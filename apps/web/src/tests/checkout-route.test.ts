import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findProduct: vi.fn(),
  findEntitlement: vi.fn(),
  findCoupon: vi.fn(),
  countPaid: vi.fn(async () => 0),
  createOrder: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: "order-1", ...data })),
  updateOrder: vi.fn(async () => ({})),
  deleteOrder: vi.fn(async () => ({})),
  fulfillOrder: vi.fn(async () => ({ ok: true })),
  createCheckout: vi.fn(async (_input: { product: { priceCents: number; stripePriceId?: string | null } }) => ({ url: "https://pay.example/session", providerRef: "cs_1" })),
}));

vi.mock("@brand/db", () => ({
  prisma: {
    product: { findUnique: mocks.findProduct },
    entitlement: { findUnique: mocks.findEntitlement },
    coupon: { findUnique: mocks.findCoupon },
    order: { create: mocks.createOrder, update: mocks.updateOrder, delete: mocks.deleteOrder, count: mocks.countPaid },
  },
}));
vi.mock("@/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/lib/verification", () => ({ needsVerification: () => false }));
vi.mock("@/lib/errors", () => ({ reportError: vi.fn(async () => {}) }));
vi.mock("@/lib/orders", () => ({ fulfillOrder: mocks.fulfillOrder }));
vi.mock("@/lib/payments", () => {
  const provider = { name: "stripe", createCheckout: mocks.createCheckout };
  return { availableProviders: () => [provider], getProvider: () => provider };
});

import { POST } from "@/app/api/checkout/route";

const product = { id: "p1", slug: "starter", published: true, comingSoon: false, type: "TEMPLATE", priceCents: 12900, currency: "usd", name: "Starter", tagline: "t", stripePriceId: "price_123" };
const coupon = (over: Record<string, unknown> = {}) => ({ code: "LAUNCH20", percentOff: 20, amountOffCents: null, productId: null, maxRedemptions: null, expiresAt: null, active: true, ...over });
const call = (body: Record<string, unknown>) =>
  POST(new Request("https://example.test/api/checkout", { method: "POST", body: JSON.stringify({ productId: "p1", locale: "en", ...body }) }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSession.mockResolvedValue({ user: { id: "u1", email: "a@b.c", name: "A" } });
  mocks.findProduct.mockResolvedValue(product);
  mocks.findEntitlement.mockResolvedValue(null);
  mocks.findCoupon.mockResolvedValue(null);
  mocks.countPaid.mockResolvedValue(0);
});

describe("checkout with and without a coupon", () => {
  it("charges the full database price when there is no coupon", async () => {
    const res = await call({});
    expect(res.status).toBe(200);
    expect(mocks.createOrder.mock.calls[0]![0].data).toMatchObject({ amountCents: 12900, discountCents: 0, couponCode: null });
    expect(mocks.createCheckout.mock.calls[0]![0].product).toMatchObject({ priceCents: 12900, stripePriceId: "price_123" });
  });

  it("ignores any price sent by the browser", async () => {
    await call({ priceCents: 1, amountCents: 1 });
    expect(mocks.createOrder.mock.calls[0]![0].data.amountCents).toBe(12900);
  });

  it("applies a valid coupon, stores it on the order and drops the fixed Stripe price", async () => {
    mocks.findCoupon.mockResolvedValue(coupon());
    const res = await call({ coupon: "launch20" });
    expect(res.status).toBe(200);
    expect(mocks.createOrder.mock.calls[0]![0].data).toMatchObject({ amountCents: 10320, discountCents: 2580, couponCode: "LAUNCH20" });
    expect(mocks.createCheckout.mock.calls[0]![0].product).toMatchObject({ priceCents: 10320, stripePriceId: null });
  });

  it("rejects an invalid coupon without creating an order", async () => {
    const res = await call({ coupon: "NOPE" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ code: "coupon" });
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("rejects a coupon that is used up", async () => {
    mocks.findCoupon.mockResolvedValue(coupon({ maxRedemptions: 3 }));
    mocks.countPaid.mockResolvedValue(3);
    expect((await call({ coupon: "LAUNCH20" })).status).toBe(400);
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("gives a 100% coupon product away without calling any payment provider", async () => {
    mocks.findCoupon.mockResolvedValue(coupon({ percentOff: 100 }));
    const res = await call({ coupon: "LAUNCH20" });
    expect(res.status).toBe(200);
    expect(mocks.createOrder.mock.calls[0]![0].data).toMatchObject({ amountCents: 0, provider: "free", couponCode: "LAUNCH20", discountCents: 12900 });
    expect(mocks.fulfillOrder).toHaveBeenCalledWith("order-1");
    expect(mocks.createCheckout).not.toHaveBeenCalled();
    expect((await res.json()).url).toContain("/checkout/success?order=order-1");
  });

  it("does not let a coupon open a product that is coming soon", async () => {
    mocks.findProduct.mockResolvedValue({ ...product, comingSoon: true });
    mocks.findCoupon.mockResolvedValue(coupon({ percentOff: 100 }));
    expect((await call({ coupon: "LAUNCH20" })).status).toBe(400);
    expect(mocks.fulfillOrder).not.toHaveBeenCalled();
  });

  it("requires a signed-in user", async () => {
    mocks.getSession.mockResolvedValue(null);
    expect((await call({})).status).toBe(401);
  });
});
