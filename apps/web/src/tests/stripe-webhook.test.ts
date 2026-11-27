import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  construct: vi.fn(),
  listSessions: vi.fn(),
  fulfillOrder: vi.fn(async () => ({ ok: true })),
  refundOrder: vi.fn(async () => ({ ok: true })),
  findOrder: vi.fn(),
}));

vi.mock("@brand/db", () => ({ prisma: { order: { findUnique: mocks.findOrder } } }));
vi.mock("@/lib/payments/stripe", () => ({
  getStripe: () => ({ webhooks: { constructEvent: mocks.construct }, checkout: { sessions: { list: mocks.listSessions } } }),
}));
vi.mock("@/lib/orders", () => ({ fulfillOrder: mocks.fulfillOrder, refundOrder: mocks.refundOrder }));

import { POST } from "@/app/api/webhooks/stripe/route";

const call = (headers: Record<string, string> = { "stripe-signature": "sig" }) =>
  POST(new Request("https://example.test/api/webhooks/stripe", { method: "POST", body: "{}", headers }));

beforeEach(() => {
  vi.clearAllMocks();
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
});

describe("Stripe webhook", () => {
  it("rejects a request with no signature or no configured secret", async () => {
    expect((await call({})).status).toBe(400);
    delete process.env.STRIPE_WEBHOOK_SECRET;
    expect((await call()).status).toBe(400);
    expect(mocks.fulfillOrder).not.toHaveBeenCalled();
  });

  it("rejects a forged signature and changes nothing", async () => {
    mocks.construct.mockImplementation(() => {
      throw new Error("bad signature");
    });
    expect((await call()).status).toBe(400);
    expect(mocks.fulfillOrder).not.toHaveBeenCalled();
  });

  it("fulfils a paid checkout session", async () => {
    mocks.construct.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: { id: "cs_1", payment_status: "paid", metadata: { orderId: "o1" } } },
    });
    expect((await call()).status).toBe(200);
    expect(mocks.fulfillOrder).toHaveBeenCalledWith("o1", "cs_1");
  });

  it("does not fulfil a session that is not paid yet", async () => {
    mocks.construct.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: { id: "cs_1", payment_status: "unpaid", metadata: { orderId: "o1" } } },
    });
    await call();
    expect(mocks.fulfillOrder).not.toHaveBeenCalled();
  });

  it("falls back to client_reference_id for the order", async () => {
    mocks.construct.mockReturnValue({
      type: "checkout.session.async_payment_succeeded",
      data: { object: { id: "cs_2", payment_status: "paid", client_reference_id: "o2" } },
    });
    await call();
    expect(mocks.fulfillOrder).toHaveBeenCalledWith("o2", "cs_2");
  });

  it("refunds the order when a charge is refunded in full", async () => {
    mocks.construct.mockReturnValue({ type: "charge.refunded", data: { object: { payment_intent: "pi_1", refunded: true } } });
    mocks.listSessions.mockResolvedValue({ data: [{ id: "cs_1" }] });
    mocks.findOrder.mockResolvedValue({ id: "o1" });
    await call();
    expect(mocks.refundOrder).toHaveBeenCalledWith("o1");
  });

  it("keeps access when a charge is only partly refunded", async () => {
    mocks.construct.mockReturnValue({ type: "charge.refunded", data: { object: { payment_intent: "pi_1", refunded: false } } });
    mocks.listSessions.mockResolvedValue({ data: [{ id: "cs_1" }] });
    mocks.findOrder.mockResolvedValue({ id: "o1" });
    await call();
    expect(mocks.refundOrder).not.toHaveBeenCalled();
  });

  it("ignores event types it does not handle", async () => {
    mocks.construct.mockReturnValue({ type: "customer.created", data: { object: {} } });
    expect((await call()).status).toBe(200);
    expect(mocks.fulfillOrder).not.toHaveBeenCalled();
  });
});
