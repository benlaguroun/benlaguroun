import { NextResponse } from "next/server";
import { prisma } from "@brand/db";
import { getSession } from "@/lib/session";
import { getPaymentProvider } from "@/lib/payments";
import { site } from "@/lib/site-url";
import { productHref } from "@/lib/format";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const { productId } = (await req.json().catch(() => ({}))) as { productId?: string };
  if (!productId) {
    return NextResponse.json({ error: "Missing productId." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.published || product.type === "SERVICE" || product.priceCents == null) {
    return NextResponse.json({ error: "This item can't be purchased online." }, { status: 400 });
  }

  const already = await prisma.entitlement.findUnique({
    where: { userId_productId: { userId: session.user.id, productId: product.id } },
  });
  if (already) {
    return NextResponse.json({ url: `${site.url}/dashboard` });
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
      successUrl: `${site.url}/checkout/success?order=${order.id}`,
      cancelUrl: `${site.url}${productHref(product)}`,
    });

    if (checkout.providerRef) {
      await prisma.order.update({ where: { id: order.id }, data: { providerRef: checkout.providerRef } });
    }
    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("Checkout creation failed", err);
    await prisma.order.delete({ where: { id: order.id } }).catch(() => {});
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
