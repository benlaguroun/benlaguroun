import { beforeEach, describe, expect, it, vi } from "vitest";

// A tiny fake database: just the tables and calls the order code uses.
const db = vi.hoisted(() => {
  const state = {
    orders: new Map<string, { id: string; userId: string; productId: string; status: string; paidAt: Date | null; provider: string; providerRef: string | null }>(),
    entitlements: [] as { userId: string; productId: string; orderId: string }[],
  };
  const prisma = {
    order: {
      findUnique: vi.fn(async ({ where }: { where: { id?: string; providerRef?: string } }) =>
        [...state.orders.values()].find((o) => (where.id ? o.id === where.id : o.providerRef === where.providerRef)) ?? null,
      ),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        Object.assign(state.orders.get(where.id)!, data);
      }),
    },
    entitlement: {
      upsert: vi.fn(async ({ where, create, update }: { where: { userId_productId: { userId: string; productId: string } }; create: { userId: string; productId: string; orderId: string }; update: { orderId: string } }) => {
        const { userId, productId } = where.userId_productId;
        const hit = state.entitlements.find((e) => e.userId === userId && e.productId === productId);
        if (hit) Object.assign(hit, update);
        else state.entitlements.push({ ...create });
      }),
      deleteMany: vi.fn(async ({ where }: { where: { orderId: string } }) => {
        state.entitlements = state.entitlements.filter((e) => e.orderId !== where.orderId);
      }),
    },
    $transaction: vi.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  };
  return { state, prisma };
});

const sendReceiptEmails = vi.hoisted(() => vi.fn(async () => {}));
const stripe = vi.hoisted(() => ({
  checkout: { sessions: { retrieve: vi.fn() } },
  refunds: { create: vi.fn() },
}));
const refundPayPalOrder = vi.hoisted(() => vi.fn(async () => {}));

vi.mock("@brand/db", () => ({ prisma: db.prisma }));
vi.mock("@/lib/receipt", () => ({ sendReceiptEmails }));
vi.mock("@/lib/payments/stripe", () => ({ getStripe: () => stripe }));
vi.mock("@/lib/payments/paypal", () => ({ refundPayPalOrder }));

import { fulfillOrder, refundOrder, refundOrderWithProvider } from "@/lib/orders";

const addOrder = (over: Partial<{ id: string; status: string; provider: string; providerRef: string | null; paidAt: Date | null }> = {}) => {
  const o = { id: "o1", userId: "u1", productId: "p1", status: "PENDING", paidAt: null, provider: "stripe", providerRef: "cs_1", ...over };
  db.state.orders.set(o.id, o);
  return o;
};

beforeEach(() => {
  db.state.orders.clear();
  db.state.entitlements = [];
  vi.clearAllMocks();
});

describe("fulfillOrder", () => {
  it("marks the order paid, grants access and sends the receipt", async () => {
    addOrder();
    expect(await fulfillOrder("o1", "cs_1")).toEqual({ ok: true });
    expect(db.state.orders.get("o1")?.status).toBe("PAID");
    expect(db.state.orders.get("o1")?.paidAt).toBeInstanceOf(Date);
    expect(db.state.entitlements).toEqual([{ userId: "u1", productId: "p1", orderId: "o1" }]);
    expect(sendReceiptEmails).toHaveBeenCalledWith("o1");
  });

  it("is safe to run twice, as webhooks are retried: one entitlement, same paid date", async () => {
    addOrder();
    await fulfillOrder("o1", "cs_1");
    const firstPaidAt = db.state.orders.get("o1")!.paidAt;
    await fulfillOrder("o1", "cs_1");
    expect(db.state.entitlements).toHaveLength(1);
    expect(db.state.orders.get("o1")!.paidAt).toBe(firstPaidAt);
  });

  it("reports an unknown order without granting anything", async () => {
    expect(await fulfillOrder("missing")).toEqual({ ok: false, reason: "order-not-found" });
    expect(db.state.entitlements).toHaveLength(0);
    expect(sendReceiptEmails).not.toHaveBeenCalled();
  });
});

describe("refundOrder", () => {
  it("marks the order refunded and removes access", async () => {
    addOrder();
    await fulfillOrder("o1");
    await refundOrder("o1");
    expect(db.state.orders.get("o1")?.status).toBe("REFUNDED");
    expect(db.state.entitlements).toHaveLength(0);
  });

  it("reports an unknown order", async () => {
    expect(await refundOrder("missing")).toEqual({ ok: false, reason: "order-not-found" });
  });
});

describe("refundOrderWithProvider", () => {
  it("refuses an order that was never paid", async () => {
    addOrder({ status: "PENDING" });
    const r = await refundOrderWithProvider("o1");
    expect(r.ok).toBe(false);
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });

  it("returns the money through Stripe once, with an idempotency key, then revokes access", async () => {
    addOrder({ status: "PAID" });
    db.state.entitlements.push({ userId: "u1", productId: "p1", orderId: "o1" });
    stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_intent: "pi_1" });
    const r = await refundOrderWithProvider("o1");
    expect(r).toEqual({ ok: true, moneyReturned: true });
    expect(stripe.refunds.create).toHaveBeenCalledWith({ payment_intent: "pi_1" }, { idempotencyKey: "refund-o1" });
    expect(db.state.orders.get("o1")?.status).toBe("REFUNDED");
    expect(db.state.entitlements).toHaveLength(0);
  });

  it("treats a refund already made in the Stripe dashboard as success", async () => {
    addOrder({ status: "PAID" });
    stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_intent: "pi_1" });
    stripe.refunds.create.mockRejectedValue(Object.assign(new Error("x"), { code: "charge_already_refunded" }));
    expect((await refundOrderWithProvider("o1")).ok).toBe(true);
    expect(db.state.orders.get("o1")?.status).toBe("REFUNDED");
  });

  it("does not revoke access when Stripe fails for another reason", async () => {
    addOrder({ status: "PAID" });
    db.state.entitlements.push({ userId: "u1", productId: "p1", orderId: "o1" });
    stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_intent: "pi_1" });
    stripe.refunds.create.mockRejectedValue(new Error("network down"));
    await expect(refundOrderWithProvider("o1")).rejects.toThrow("network down");
    expect(db.state.orders.get("o1")?.status).toBe("PAID");
    expect(db.state.entitlements).toHaveLength(1);
  });

  it("returns the money through PayPal", async () => {
    addOrder({ status: "PAID", provider: "paypal", providerRef: "pp_1" });
    const r = await refundOrderWithProvider("o1");
    expect(r).toEqual({ ok: true, moneyReturned: true });
    expect(refundPayPalOrder).toHaveBeenCalledWith("pp_1", "o1");
  });

  it("says so when the order was already refunded", async () => {
    addOrder({ status: "REFUNDED" });
    const r = await refundOrderWithProvider("o1");
    expect(r).toMatchObject({ ok: true, moneyReturned: false });
    expect(stripe.refunds.create).not.toHaveBeenCalled();
  });
});
