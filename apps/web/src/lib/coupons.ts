// Discount codes. The rules live here as plain functions so they can be tested
// without a database; `findCouponOffer` is the one function that reads it.

export type CouponRow = {
  code: string;
  percentOff: number | null;
  amountOffCents: number | null;
  productId: string | null;
  maxRedemptions: number | null;
  expiresAt: Date | null;
  active: boolean;
};

export type Offer =
  | { ok: true; code: string; discountCents: number; finalCents: number }
  | { ok: false; reason: "unknown" | "inactive" | "expired" | "used-up" | "wrong-product" | "too-small" };

/** The smallest payment Stripe accepts is about 50 cents, so a code may not leave 1 to 49. */
export const MIN_CHARGE_CENTS = 50;

/** "  launch-20 " -> "LAUNCH-20". Returns "" when the text is not a plausible code. */
export function normalizeCode(raw: unknown): string {
  const code = String(raw ?? "").trim().toUpperCase();
  return /^[A-Z0-9][A-Z0-9_-]{1,31}$/.test(code) ? code : "";
}

/** How much a coupon takes off a price, never more than the price itself. */
export function discountFor(coupon: Pick<CouponRow, "percentOff" | "amountOffCents">, priceCents: number): number {
  let off = 0;
  if (coupon.percentOff) off = Math.round((priceCents * coupon.percentOff) / 100);
  else if (coupon.amountOffCents) off = coupon.amountOffCents;
  return Math.max(0, Math.min(off, priceCents));
}

/**
 * Decides whether a coupon can be used on a product right now.
 * `used` is the number of paid orders that already used the code.
 */
export function evaluateCoupon(
  coupon: CouponRow | null,
  product: { id: string; priceCents: number },
  used: number,
  now = new Date(),
): Offer {
  if (!coupon) return { ok: false, reason: "unknown" };
  if (!coupon.active) return { ok: false, reason: "inactive" };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < now.getTime()) return { ok: false, reason: "expired" };
  if (coupon.maxRedemptions != null && used >= coupon.maxRedemptions) return { ok: false, reason: "used-up" };
  if (coupon.productId && coupon.productId !== product.id) return { ok: false, reason: "wrong-product" };

  const discountCents = discountFor(coupon, product.priceCents);
  const finalCents = product.priceCents - discountCents;
  if (discountCents <= 0) return { ok: false, reason: "unknown" };
  if (finalCents > 0 && finalCents < MIN_CHARGE_CENTS) return { ok: false, reason: "too-small" };
  return { ok: true, code: coupon.code, discountCents, finalCents };
}
