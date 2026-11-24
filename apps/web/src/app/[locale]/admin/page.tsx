import Link from "next/link";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDate, money, startOfMonth } from "@/lib/admin-format";
import { getPaymentRows } from "@/lib/admin-data";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, Pill, StatCard, leadTone } from "@/components/admin/ui";
import { PaymentTable } from "@/components/admin/payment-table";

export const dynamic = "force-dynamic";

export default async function AdminOverview({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);

  const month = startOfMonth();
  const [storeAll, manualAll, storeMonth, manualMonth, pending, newMessages, activeClients, accounts, leads, rows] =
    await Promise.all([
      prisma.order.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
      prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
      prisma.order.aggregate({ where: { status: "PAID", paidAt: { gte: month } }, _sum: { amountCents: true } }),
      prisma.payment.aggregate({ where: { status: "PAID", paidAt: { gte: month } }, _sum: { amountCents: true } }),
      prisma.payment.aggregate({ where: { status: "PENDING" }, _sum: { amountCents: true }, _count: true }),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.client.count({ where: { status: "ACTIVE" } }),
      prisma.user.count(),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      getPaymentRows({ limit: 6, locale }),
    ]);

  const total = (storeAll._sum.amountCents ?? 0) + (manualAll._sum.amountCents ?? 0);
  const thisMonth = (storeMonth._sum.amountCents ?? 0) + (manualMonth._sum.amountCents ?? 0);

  return (
    <>
      <AdminHeading title="Overview">
        <Link href={`/${locale}/admin/clients/new`} className="btn btn-glass !px-4 !py-2">New client</Link>
        <Link href={`/${locale}/admin/payments`} className="btn btn-primary !px-4 !py-2">Record payment</Link>
      </AdminHeading>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Revenue this month" value={money(thisMonth)} hint="Store sales + recorded payments" />
        <StatCard label="Revenue all time" value={money(total)} hint="Assumes USD, see note on Payments" />
        <StatCard
          label="Waiting to be paid"
          value={money(pending._sum.amountCents ?? 0)}
          hint={`${pending._count} pending payment${pending._count === 1 ? "" : "s"}`}
        />
        <StatCard label="New messages" value={String(newMessages)} hint="Unread contact form messages" />
        <StatCard label="Active clients" value={String(activeClients)} />
        <StatCard label="Website accounts" value={String(accounts)} hint="People who signed up on the site" />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="display text-xl font-semibold">Latest messages</h2>
          <Link href={`/${locale}/admin/messages`} className="text-sm font-medium text-aqua hover:underline">All messages</Link>
        </div>
        {leads.length === 0 ? (
          <Empty>No messages yet. They appear here when someone uses your contact form.</Empty>
        ) : (
          <ul className="glass divide-y divide-line">
            {leads.map((l) => (
              <li key={l.id}>
                <Link href={`/${locale}/admin/messages/${l.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-white/5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{l.name}</span>
                    <span className="block truncate text-sm text-mute">{l.message}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <Pill tone={leadTone[l.status]}>{l.status.toLowerCase()}</Pill>
                    <span className="hidden text-xs text-mute sm:block">{fmtDate(l.createdAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="display text-xl font-semibold">Latest payments</h2>
          <Link href={`/${locale}/admin/payments`} className="text-sm font-medium text-aqua hover:underline">All payments</Link>
        </div>
        {rows.length === 0 ? (
          <Empty>No payments yet.</Empty>
        ) : (
          <PaymentTable rows={rows} locale={locale} returnTo={`/${locale}/admin`} />
        )}
      </section>
    </>
  );
}
