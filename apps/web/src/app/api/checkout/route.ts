import { NextResponse } from "next/server";
import { prisma } from "@brand/db";
import { getSession } from "@/lib/session";
import { getPaymentProvider } from "@/lib/payments";
import { site } from "@/lib/site-url";
import { productPath } from "@/lib/format";
import { defaultLocale, isLocale, lp } from "@/i18n/config";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ code: "signin" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { productId?: string; locale?: string };
  const { productId } = body;
  const locale = isLocale(body.locale) ? body.locale : defaultLocale;
  if (!productId) {
    return NextResponse.json({ code: "invalid" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.published || product.type === "SERVICE" || product.priceCents == null) {
    return NextResponse.json({ code: "invalid" }, { status: 400 });
  }

  const already = await prisma.entitlement.findUnique({
    where: { userId_productId: { userId: session.user.id, productId: product.id } },
  });
  if (already) {
    return NextResponse.json({ url: `${site.url}${lp(locale, "/dashboard")}` });
  }

  const provider = getPaymentProvider();

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      amountCents: product.priceCents,
      currency: product.currency,
      provider: provider.name,
    },
  });

  try {
    const checkout = await provider.createCheckout({
      orderId: order.id,
      product: {
        name: product.name,
        description: product.tagline,
        priceCents: product.priceCents,
        currency: product.currency,
        stripePriceId: product.stripePriceId,
        lemonVariantId: product.lemonVariantId,
      },
      customer: { email: session.user.email, name: session.user.name },
      successUrl: `${site.url}${lp(locale, "/checkout/success")}?order=${order.id}`,
      cancelUrl: `${site.url}${lp(locale, productPath(product))}`,
    });

    if (checkout.providerRef) {
      await prisma.order.update({ where: { id: order.id }, data: { providerRef: checkout.providerRef } });
    }
    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("Checkout creation failed", err);
    await prisma.order.delete({ where: { id: order.id } }).catch(() => {});
    return NextResponse.json({ code: "failed" }, { status: 502 });
  }
}
