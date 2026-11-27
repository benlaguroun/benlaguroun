import { describe, expect, it } from "vitest";
import { discountFor, evaluateCoupon, normalizeCode, type CouponRow } from "@/lib/coupons";

const coupon = (over: Partial<CouponRow> = {}): CouponRow => ({
  code: "LAUNCH20",
  percentOff: 20,
  amountOffCents: null,
  productId: null,
  maxRedemptions: null,
  expiresAt: null,
  active: true,
  ...over,
});
const product = { id: "p1", priceCents: 12900 };

describe("normalizeCode", () => {
  it("trims and capitalises", () => expect(normalizeCode("  launch-20 ")).toBe("LAUNCH-20"));
  it("rejects empty, too long and odd characters", () => {
    expect(normalizeCode("")).toBe("");
    expect(normalizeCode(undefined)).toBe("");
    expect(normalizeCode("a")).toBe("");
    expect(normalizeCode("x".repeat(40))).toBe("");
    expect(normalizeCode("hack';--")).toBe("");
  });
});

describe("discountFor", () => {
  it("takes a percentage off, rounded to the cent", () => {
    expect(discountFor({ percentOff: 20, amountOffCents: null }, 12900)).toBe(2580);
    expect(discountFor({ percentOff: 33, amountOffCents: null }, 999)).toBe(330);
  });
  it("takes a fixed amount off", () => expect(discountFor({ percentOff: null, amountOffCents: 1000 }, 12900)).toBe(1000));
  it("never takes off more than the price", () => expect(discountFor({ percentOff: null, amountOffCents: 99999 }, 5900)).toBe(5900));
  it("is zero for a coupon with no value", () => expect(discountFor({ percentOff: null, amountOffCents: null }, 5900)).toBe(0));
});

describe("evaluateCoupon", () => {
  it("applies a valid code", () => {
    expect(evaluateCoupon(coupon(), product, 0)).toEqual({ ok: true, code: "LAUNCH20", discountCents: 2580, finalCents: 10320 });
  });
  it("refuses an unknown code", () => expect(evaluateCoupon(null, product, 0)).toEqual({ ok: false, reason: "unknown" }));
  it("refuses a switched-off code", () => expect(evaluateCoupon(coupon({ active: false }), product, 0)).toMatchObject({ ok: false, reason: "inactive" }));
  it("refuses an expired code but accepts one that has not expired yet", () => {
    const now = new Date("2027-01-10T00:00:00Z");
    expect(evaluateCoupon(coupon({ expiresAt: new Date("2027-01-09T00:00:00Z") }), product, 0, now)).toMatchObject({ ok: false, reason: "expired" });
    expect(evaluateCoupon(coupon({ expiresAt: new Date("2027-01-11T00:00:00Z") }), product, 0, now).ok).toBe(true);
  });
  it("stops when the limit is reached", () => {
    expect(evaluateCoupon(coupon({ maxRedemptions: 5 }), product, 4).ok).toBe(true);
    expect(evaluateCoupon(coupon({ maxRedemptions: 5 }), product, 5)).toMatchObject({ ok: false, reason: "used-up" });
  });
  it("respects a code limited to one product", () => {
    expect(evaluateCoupon(coupon({ productId: "p2" }), product, 0)).toMatchObject({ ok: false, reason: "wrong-product" });
    expect(evaluateCoupon(coupon({ productId: "p1" }), product, 0).ok).toBe(true);
  });
  it("allows 100% off, which makes the product free", () => {
    expect(evaluateCoupon(coupon({ percentOff: 100 }), product, 0)).toMatchObject({ ok: true, discountCents: 12900, finalCents: 0 });
  });
  it("refuses a code that would leave a charge too small to process", () => {
    expect(evaluateCoupon(coupon({ percentOff: null, amountOffCents: 12880 }), product, 0)).toMatchObject({ ok: false, reason: "too-small" });
  });
  it("refuses a code that takes nothing off", () => {
    expect(evaluateCoupon(coupon({ percentOff: null, amountOffCents: null }), product, 0).ok).toBe(false);
  });
});
