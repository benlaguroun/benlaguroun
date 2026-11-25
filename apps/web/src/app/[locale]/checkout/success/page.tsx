import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { lp, localeMeta } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { formatPrice, productPath } from "@/lib/format";
import { fulfillOrder } from "@/lib/orders";
import { providerLabel } from "@/lib/payments/labels";
import { getStripe } from "@/lib/payments/stripe";
import { requireSession } from "@/lib/session";
import { Check } from "@/components/icons";
import { reportError } from "@/lib/errors";
import { AutoRefresh } from "@/components/auto-refresh";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccess({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const c = t.checkout;
  const { order: orderId } = await searchParams;
  const session = await requireSession(locale, lp(locale, "/dashboard"));

  const load = () =>
    orderId
      ? prisma.order.findFirst({ where: { id: orderId, userId: session.user.id }, include: { product: true } })
      : Promise.resolve(null);

  let order = await load();

  // The buyer can arrive before Stripe's webhook does. Ask Stripe directly so
  // they get access straight away; the webhook stays as the safety net.
  if (order && order.status === "PENDING" && order.provider === "stripe" && order.providerRef) {
    try {
      const checkout = await getStripe().checkout.sessions.retrieve(order.providerRef);
      if (checkout.payment_status === "paid" && checkout.metadata?.orderId === order.id) {
        await fulfillOrder(order.id, checkout.id);
        order = await load();
      }
    } catch (err) {
      console.error("Could not confirm the Stripe payment", err);
      await reportError("payment", err, `Stripe confirmation, order ${orderId}`);
    }
  }

  const paid = order?.status === "PAID";
  const product = order ? localize(order.product, locale) : null;
  const raw = order?.product;

  return (
    <div className="wrap max-w-xl py-20">
      {order?.status === "PENDING" && <AutoRefresh />}
      <div className="glass p-10 text-center">
        {paid && (
          <span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-aqua/15 text-aqua">
            <Check className="h-7 w-7" />
          </span>
        )}
        <h1 className="display text-4xl font-semibold">
          <span className="text-gradient">{paid ? c.paidTitle : c.pendingTitle}</span>
        </h1>
        <p className="mt-4 text-mute">{paid && product ? fill(c.paidBody, { name: product.name }) : c.pendingBody}</p>

        {order && product && raw && (
          <dl className="mt-8 space-y-2 rounded-2xl bg-white/5 p-5 text-start text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-mute">{product.name}</dt>
              <dd className="font-medium">{formatPrice(order.amountCents, order.currency, locale, "")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">{c.order}</dt>
              <dd className="font-mono text-xs" dir="ltr">
                {order.id.slice(-8).toUpperCase()} · {providerLabel(order.provider)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">{(order.paidAt ?? order.createdAt).toLocaleDateString(localeMeta[locale].intl, { dateStyle: "medium" })}</dt>
              <dd>{paid ? c.paid : t.dashboard.status[order.status]}</dd>
            </div>
          </dl>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {paid && raw?.type === "COURSE" && (
            <Link href={lp(locale, `/learn/${raw.slug}`)} className="btn btn-primary">{c.startCourse}</Link>
          )}
          {paid && raw?.type === "TEMPLATE" && (raw.deliveryFile || raw.deliveryUrl) && (
            <a href={`/api/download/${raw.id}`} className="btn btn-primary">{c.download}</a>
          )}
          <Link href={lp(locale, "/dashboard")} className={`btn ${paid && raw && (raw.type === "COURSE" || raw.deliveryFile || raw.deliveryUrl) ? "btn-glass" : "btn-primary"}`}>
            {c.openLibrary}
          </Link>
          {raw && <Link href={lp(locale, productPath(raw))} className="btn btn-glass">{c.viewProduct}</Link>}
        </div>
      </div>
    </div>
  );
}
