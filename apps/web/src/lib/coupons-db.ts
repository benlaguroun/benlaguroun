import { prisma } from "@brand/db";
import { evaluateCoupon, normalizeCode, type Offer } from "@/lib/coupons";

/** Looks the code up and decides whether it works on this product. Always asks the database, never the browser. */
export async function findCouponOffer(rawCode: unknown, product: { id: string; priceCents: number }): Promise<Offer> {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, reason: "unknown" };
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  const used = coupon ? await prisma.order.count({ where: { couponCode: code, status: "PAID" } }) : 0;
  return evaluateCoupon(coupon, product, used);
}
