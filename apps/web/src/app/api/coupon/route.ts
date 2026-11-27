import { NextResponse } from "next/server";
import { prisma } from "@brand/db";
import { getSession } from "@/lib/session";
import { findCouponOffer } from "@/lib/coupons-db";
import { rateLimited } from "@/lib/rate-limit";
import { formatPrice } from "@/lib/format";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * "Does this code work, and what would I pay?" The checkout box calls this when
 * someone presses Apply. It is only a preview: /api/checkout checks the code again
 * and sets the real price.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, code: "signin" }, { status: 401 });

  // Stops someone from guessing codes.
  if (rateLimited(`coupon:${session.user.id}`, 15, 10 * 60_000)) {
    return NextResponse.json({ ok: false, code: "many" }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as { productId?: string; code?: string; locale?: string };
  const locale = isLocale(body.locale) ? body.locale : defaultLocale;
  const product = body.productId ? await prisma.product.findUnique({ where: { id: body.productId } }) : null;
  if (!product || !product.published || product.priceCents == null) {
    return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
  }

  const offer = await findCouponOffer(body.code, { id: product.id, priceCents: product.priceCents });
  // One message for every reason, so the box does not reveal which codes exist.
  if (!offer.ok) return NextResponse.json({ ok: false, code: "coupon" }, { status: 200 });

  return NextResponse.json({
    ok: true,
    free: offer.finalCents === 0,
    discount: formatPrice(offer.discountCents, product.currency, locale, ""),
    total: formatPrice(offer.finalCents, product.currency, locale, ""),
  });
}
