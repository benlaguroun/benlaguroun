import { NextResponse } from "next/server";
import { prisma } from "@brand/db";
import { getSession } from "@/lib/session";
import { availableProviders, getProvider } from "@/lib/payments";
import { site } from "@/lib/site-url";
import { defaultLocale, isLocale, lp } from "@/i18n/config";
import { reportError } from "@/lib/errors";
import { needsVerification } from "@/lib/verification";

type Code = "signin" | "invalid" | "failed" | "method" | "verify";

const fail = (code: Code, status: number) => NextResponse.json({ code }, { status });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return fail("signin", 401);
  if (needsVerification(session.user as { emailVerified?: boolean; role?: string })) return fail("verify", 403);

  const body = (await req.json().catch(() => ({}))) as { productId?: string; locale?: string; provider?: string };
  const locale = isLocale(body.locale) ? body.locale : defaultLocale;
  if (!body.productId) return fail("invalid", 400);

  const product = await prisma.product.findUnique({ where: { id: body.productId } });
  if (!product || !product.published || product.type === "SERVICE" || product.priceCents == null) {
    return fail("invalid", 400);
  }

  // The buyer's choice, or the only method on offer.
  const methods = availableProviders(product.currency);
  const provider = body.provider ? getProvider(body.provider, product.currency) : methods.length === 1 ? methods[0] : null;
  if (!provider) return fail("method", 400);

  const already = await prisma.entitlement.findUnique({
    where: { userId_productId: { userId: session.user.id, productId: product.id } },
  });
  if (already) return NextResponse.json({ url: `${site.url}${lp(locale, "/dashboard")}` });

  // The price always comes from the database, never from the browser.
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      amountCents: product.priceCents,
      currency: product.currency,
      provider: provider.name,
      locale,
    },
  });

  try {
    const checkout = await provider.createCheckout({
      orderId: order.id,
      locale,
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
      cancelUrl: `${site.url}${lp(locale, `/checkout/${product.slug}`)}?cancelled=1`,
    });

    if (checkout.providerRef) {
      await prisma.order.update({ where: { id: order.id }, data: { providerRef: checkout.providerRef } });
    }
    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error(`${provider.name} checkout creation failed`, err);
    await reportError("payment", err, `${provider.name} checkout for ${order.productId}`);
    await prisma.order.delete({ where: { id: order.id } }).catch(() => {});
    return fail("failed", 502);
  }
}

