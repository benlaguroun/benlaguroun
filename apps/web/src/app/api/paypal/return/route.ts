import { NextResponse } from "next/server";
import { prisma } from "@brand/db";
import { getSession } from "@/lib/session";
import { capturePayPalOrder } from "@/lib/payments/paypal";
import { fulfillOrder } from "@/lib/orders";
import { defaultLocale, isLocale, lp } from "@/i18n/config";
import { site } from "@/lib/site-url";

/**
 * PayPal sends the buyer here after they approve the payment. We take the money
 * (capture), check the amount, grant access, then show the thank-you page.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const locale = isLocale(url.searchParams.get("locale")) ? (url.searchParams.get("locale") as typeof defaultLocale) : defaultLocale;
  const go = (path: string) => NextResponse.redirect(new URL(path, site.url));

  const session = await getSession();
  const orderId = url.searchParams.get("order");
  const token = url.searchParams.get("token"); // PayPal's order id
  if (!session || !orderId) return go(lp(locale, "/dashboard"));

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, provider: "paypal" },
    include: { product: { select: { slug: true } } },
  });
  if (!order) return go(lp(locale, "/dashboard"));

  const success = lp(locale, `/checkout/success?order=${order.id}`);
  if (order.status === "PAID") return go(success);

  const retry = lp(locale, `/checkout/${order.product.slug}?error=1`);
  // The id PayPal gives back must be the one we created for this order.
  if (!token || order.providerRef !== token) return go(retry);

  try {
    const result = await capturePayPalOrder(token);
    if (result.status === "pending") return go(success); // the webhook confirms it later
    if (result.status === "failed") return go(retry);

    const expected = (order.amountCents / 100).toFixed(2);
    if (result.amount !== expected || result.currency !== order.currency.toUpperCase() || result.customId !== order.id) {
      console.error("PayPal capture did not match the order", { orderId: order.id, result });
      return go(retry);
    }

    await fulfillOrder(order.id, token);
    return go(success);
  } catch (err) {
    console.error("PayPal capture failed", err);
    return go(retry);
  }
}
