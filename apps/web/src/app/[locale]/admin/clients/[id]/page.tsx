import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDate, money } from "@/lib/admin-format";
import { methodLabel, type PaymentRow } from "@/lib/admin-data";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner, Pill, StatCard, clientTone, leadTone } from "@/components/admin/ui";
import { ClientForm } from "@/components/admin/client-form";
import { PaymentForm } from "@/components/admin/payment-form";
import { PaymentTable } from "@/components/admin/payment-table";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function ClientPage({ params, searchParams }: Props) {
  const { id } = await params;
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error, saved } = await searchParams;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      leads: { orderBy: { createdAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true } },
    },
  });
  if (!client) notFound();

  // Store purchases made with the linked website account, if any.
  const orders = client.userId
    ? await prisma.order.findMany({
        where: { userId: client.userId, status: { not: "PENDING" } },
        orderBy: { createdAt: "desc" },
        include: { product: { select: { name: true } } },
      })
    : [];

  const rows: PaymentRow[] = [
    ...client.payments.map((p) => ({
      id: p.id,
      kind: "manual" as const,
      who: client.name,
      description: p.description,
      amountCents: p.amountCents,
      currency: p.currency,
      status: p.status,
      method: methodLabel(p.method),
      date: p.paidAt ?? p.createdAt,
      editable: true,
    })),
    ...orders.map((o) => ({
      id: o.id,
      kind: "store" as const,
      who: client.name,
      description: o.product.name,
      amountCents: o.amountCents,
      currency: o.currency,
      status: o.status,
      method: o.provider === "lemonsqueezy" ? "Lemon Squeezy" : "Stripe",
      date: o.paidAt ?? o.createdAt,
      editable: false,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const paid = rows.filter((r) => r.status === "PAID").reduce((n, r) => n + r.amountCents, 0);
  const pending = rows.filter((r) => r.status === "PENDING").reduce((n, r) => n + r.amountCents, 0);
  const here = `/${locale}/admin/clients/${client.id}`;

  return (
    <>
      <Link href={`/${locale}/admin/clients`} className="text-sm text-mute hover:text-ink">← All clients</Link>
      <div className="mt-4">
        <AdminHeading title={client.name}>
          <Pill tone={clientTone[client.status]}>{client.status.toLowerCase()}</Pill>
          {client.user && <Pill tone="info">has website account</Pill>}
        </AdminHeading>
      </div>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          Saved.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Paid" value={money(paid)} />
        <StatCard label="Pending" value={money(pending)} />
        <StatCard label="Client since" value={fmtDate(client.createdAt)} />
      </div>

      <section className="mt-8">
        <h2 className="display mb-4 text-xl font-semibold">Details</h2>
        <ClientForm locale={locale} client={client} />
      </section>

      <section className="mt-10">
        <h2 className="display mb-4 text-xl font-semibold">Payments</h2>
        {rows.length > 0 && (
          <div className="mb-5">
            <PaymentTable rows={rows} locale={locale} returnTo={here} />
          </div>
        )}
        <details className="glass p-1">
          <summary className="cursor-pointer list-none rounded-xl px-5 py-3 text-sm font-semibold text-aqua">
            + Record a payment for {client.name}
          </summary>
          <div className="p-2">
            <PaymentForm locale={locale} returnTo={here} clients={[]} clientId={client.id} />
          </div>
        </details>
      </section>

      <section className="mt-10">
        <h2 className="display mb-4 text-xl font-semibold">Messages</h2>
        {client.leads.length === 0 ? (
          <p className="text-sm text-mute">No messages linked to this client.</p>
        ) : (
          <ul className="glass divide-y divide-line">
            {client.leads.map((l) => (
              <li key={l.id}>
                <Link href={`/${locale}/admin/messages/${l.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-white/5">
                  <span className="min-w-0 truncate text-sm text-mute">{l.message}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <Pill tone={leadTone[l.status]}>{l.status.toLowerCase()}</Pill>
                    <span className="text-xs text-mute">{fmtDate(l.createdAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
