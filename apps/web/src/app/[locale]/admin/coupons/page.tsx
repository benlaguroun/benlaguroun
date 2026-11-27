import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { fmtDate, money } from "@/lib/admin-format";
import { AdminHeading, Empty, ErrorBanner, Pill } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CouponForm } from "@/components/admin/coupon-form";
import { deleteCoupon, setCouponActive } from "../catalog-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminCouponsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error, saved } = await searchParams;

  const [coupons, products, usage] = await Promise.all([
    prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { type: { not: "SERVICE" } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.order.groupBy({ by: ["couponCode"], where: { couponCode: { not: null }, status: "PAID" }, _count: { _all: true } }),
  ]);
  const used = new Map<string | null, number>(
    usage.map((u: { couponCode: string | null; _count: { _all: number } }): [string | null, number] => [u.couponCode, u._count._all]),
  );
  const nameOf = new Map<string, string>(products.map((p: { id: string; name: string }): [string, string] => [p.id, p.name]));
  const now = Date.now();

  return (
    <>
      <AdminHeading title="Coupons" />
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Discount codes for launches, your newsletter list or a friend. The buyer types the code on the checkout page and the server
        works out the price again when they pay. A code worth 100% gives the product away without any payment, which is how you can
        offer a free template. Uses are counted from paid orders, so a refund gives the use back.
      </p>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      <details className="glass mb-6 p-5" open={coupons.length === 0}>
        <summary className="cursor-pointer font-medium">+ Create a coupon</summary>
        <div className="mt-5">
          <CouponForm locale={locale} products={products} />
        </div>
      </details>

      {coupons.length === 0 ? (
        <Empty>No coupons yet.</Empty>
      ) : (
        <ul className="space-y-4">
          {coupons.map((c: (typeof coupons)[number]) => {
            const expired = !!c.expiresAt && c.expiresAt.getTime() < now;
            const count = used.get(c.code) ?? 0;
            const usedUp = c.maxRedemptions != null && count >= c.maxRedemptions;
            const live = c.active && !expired && !usedUp;
            return (
              <li key={c.id} className="glass p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-lg font-semibold tracking-wide">{c.code}</p>
                    <p className="mt-1 text-sm text-mute">
                      {c.percentOff ? `${c.percentOff}% off` : `${money(c.amountOffCents ?? 0)} off`} ·{" "}
                      {c.productId ? (nameOf.get(c.productId) ?? "one product") : "every product"} · used {count}
                      {c.maxRedemptions != null ? ` of ${c.maxRedemptions}` : ""} times
                      {c.expiresAt ? ` · until ${fmtDate(c.expiresAt)}` : ""}
                    </p>
                    {c.note && <p className="mt-1 text-xs text-mute">{c.note}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone={live ? "good" : "warn"}>{live ? "working" : expired ? "expired" : usedUp ? "used up" : "off"}</Pill>
                    <form action={setCouponActive}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="active" value={c.active ? "0" : "1"} />
                      <button type="submit" className="btn btn-glass !px-3 !py-1.5 !text-xs">{c.active ? "Switch off" : "Switch on"}</button>
                    </form>
                  </div>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-aqua">Edit</summary>
                  <div className="mt-4">
                    <CouponForm locale={locale} products={products} item={c} />
                    <form action={deleteCoupon} className="mt-4 border-t border-line pt-4">
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <ConfirmButton message={`Delete the code ${c.code}? Past orders keep it in their record.`}>Delete</ConfirmButton>
                    </form>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
