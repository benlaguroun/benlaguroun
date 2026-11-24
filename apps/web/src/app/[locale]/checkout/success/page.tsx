import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { productPath } from "@/lib/format";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccess({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale).checkout;
  const { order: orderId } = await searchParams;
  const session = await requireSession(locale, lp(locale, "/dashboard"));

  const order = orderId
    ? await prisma.order.findFirst({
        where: { id: orderId, userId: session.user.id },
        include: { product: true },
      })
    : null;

  const paid = order?.status === "PAID";
  const name = order ? localize(order.product, locale).name : "";

  return (
    <div className="wrap max-w-xl py-24 text-center">
      <div className="glass p-10">
        <h1 className="display text-4xl font-semibold">
          <span className="text-gradient">{paid ? t.paidTitle : t.pendingTitle}</span>
        </h1>
        <p className="mt-4 text-mute">{paid ? fill(t.paidBody, { name }) : t.pendingBody}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={lp(locale, "/dashboard")} className="btn btn-primary">{t.openLibrary}</Link>
          {order && (
            <Link href={lp(locale, productPath(order.product))} className="btn btn-glass">{t.viewProduct}</Link>
          )}
        </div>
      </div>
    </div>
  );
}
