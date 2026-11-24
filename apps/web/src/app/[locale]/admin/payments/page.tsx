import Link from "next/link";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { money } from "@/lib/admin-format";
import { getPaymentRows } from "@/lib/admin-data";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, ErrorBanner, Filters, StatCard } from "@/components/admin/ui";
import { PaymentForm } from "@/components/admin/payment-form";
import { PaymentTable } from "@/components/admin/payment-table";

export const dynamic = "force-dynamic";

const VIEWS = ["all", "store", "manual"] as const;
const STATUSES = ["PENDING", "PAID", "REFUNDED"] as const;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string; status?: string; error?: string }>;
};

export default async function PaymentsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const sp = await searchParams;
  const view = VIEWS.find((v) => v === sp.view) ?? "all";
  const status = STATUSES.find((s) => s === sp.status);

  const [rows, clients, paidStore, paidManual, pending] = await Promise.all([
    getPaymentRows({ view, status, locale, limit: 200 }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
    prisma.payment.aggregate({ where: { status: "PENDING" }, _sum: { amountCents: true } }),
  ]);

  const base = `/${locale}/admin/payments`;
  const qs = (v: string, s?: string) => {
    const p = new URLSearchParams();
    if (v !== "all") p.set("view", v);
    if (s) p.set("status", s);
    const str = p.toString();
    return str ? `${base}?${str}` : base;
  };
  const current = `${base}${view !== "all" || status ? `?${new URLSearchParams({ ...(view !== "all" ? { view } : {}), ...(status ? { status } : {}) })}` : ""}`;

  return (
    <>
      <AdminHeading title="Payments" />
      <ErrorBanner message={sp.error} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Store sales" value={money(paidStore._sum.amountCents ?? 0)} hint="Paid orders from the website" />
        <StatCard label="Recorded payments" value={money(paidManual._sum.amountCents ?? 0)} hint="Paid, added by you" />
        <StatCard label="Waiting to be paid" value={money(pending._sum.amountCents ?? 0)} hint="Pending recorded payments" />
      </div>
      <p className="mt-3 text-xs text-mute">
        Totals add amounts together as if they were all in the same currency. If you invoice in several currencies,
        read the amounts in the table instead.
      </p>

      <details className="glass mt-8 p-1" open={clients.length > 0 && !!sp.error}>
        <summary className="cursor-pointer list-none rounded-xl px-5 py-3 text-sm font-semibold text-aqua">
          + Record a payment (bank transfer, cash, invoice...)
        </summary>
        <div className="p-2">
          {clients.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-mute">
              Add a client first, then record their payments here.{" "}
              <Link href={`/${locale}/admin/clients/new`} className="font-semibold text-aqua hover:underline">New client</Link>
            </p>
          ) : (
            <PaymentForm locale={locale} returnTo={current} clients={clients} />
          )}
        </div>
      </details>

      <div className="mt-8">
        <Filters
          current={view}
          items={[
            { key: "all", label: "Everything", href: qs("all", status) },
            { key: "store", label: "Store sales", href: qs("store", status) },
            { key: "manual", label: "Recorded by me", href: qs("manual", status) },
          ]}
        />
        <Filters
          current={status ?? "any"}
          items={[
            { key: "any", label: "Any status", href: qs(view) },
            { key: "PENDING", label: "Pending", href: qs(view, "PENDING") },
            { key: "PAID", label: "Paid", href: qs(view, "PAID") },
            { key: "REFUNDED", label: "Refunded", href: qs(view, "REFUNDED") },
          ]}
        />
      </div>

      {rows.length === 0 ? (
        <Empty>No payments match this view yet.</Empty>
      ) : (
        <PaymentTable rows={rows} locale={locale} returnTo={current} />
      )}
    </>
  );
}
