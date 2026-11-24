import Link from "next/link";
import { prisma, type ClientStatus } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { money } from "@/lib/admin-format";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, Filters, Pill, clientTone } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const STATUSES: ClientStatus[] = ["PROSPECT", "ACTIVE", "PAST"];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function ClientsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { q, status } = await searchParams;
  const filter = STATUSES.find((s) => s === status);
  const term = q?.trim();

  const clients = await prisma.client.findMany({
    where: {
      ...(filter ? { status: filter } : {}),
      ...(term
        ? {
            OR: [
              { name: { contains: term, mode: "insensitive" } },
              { email: { contains: term, mode: "insensitive" } },
              { company: { contains: term, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { payments: { select: { amountCents: true, status: true } } },
  });

  const base = `/${locale}/admin/clients`;
  const qs = (s?: string) => {
    const p = new URLSearchParams();
    if (s) p.set("status", s);
    if (term) p.set("q", term);
    const str = p.toString();
    return str ? `${base}?${str}` : base;
  };

  return (
    <>
      <AdminHeading title="Clients">
        <Link href={`${base}/new`} className="btn btn-primary !px-4 !py-2">New client</Link>
      </AdminHeading>

      <form className="mb-5 flex gap-2" action={base}>
        {filter && <input type="hidden" name="status" value={filter} />}
        <input name="q" defaultValue={term} placeholder="Search name, email or company" className="field max-w-sm" />
        <button className="btn btn-glass !px-4">Search</button>
      </form>

      <Filters
        current={filter ?? "all"}
        items={[
          { key: "all", label: "All", href: qs() },
          { key: "PROSPECT", label: "Prospects", href: qs("PROSPECT") },
          { key: "ACTIVE", label: "Active", href: qs("ACTIVE") },
          { key: "PAST", label: "Past", href: qs("PAST") },
        ]}
      />

      {clients.length === 0 ? (
        <Empty>
          No clients found. Create one with the button above, or open a message and choose “Convert to client”.
        </Empty>
      ) : (
        <div className="glass overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[0.68rem] uppercase tracking-wider text-mute">
                <th className="px-5 py-3 text-start font-medium">Client</th>
                <th className="px-5 py-3 text-start font-medium">Status</th>
                <th className="px-5 py-3 text-start font-medium">Paid</th>
                <th className="px-5 py-3 text-start font-medium">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {clients.map((c) => {
                const paid = c.payments.filter((p) => p.status === "PAID").reduce((n, p) => n + p.amountCents, 0);
                const pending = c.payments.filter((p) => p.status === "PENDING").reduce((n, p) => n + p.amountCents, 0);
                return (
                  <tr key={c.id} className="transition hover:bg-white/5">
                    <td className="px-5 py-3.5">
                      <Link href={`${base}/${c.id}`} className="block">
                        <span className="font-medium">{c.name}</span>
                        <span className="block text-xs text-mute">
                          {[c.company, c.email].filter(Boolean).join(" · ") || "No contact details"}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5"><Pill tone={clientTone[c.status]}>{c.status.toLowerCase()}</Pill></td>
                    <td className="px-5 py-3.5">{money(paid)}</td>
                    <td className="px-5 py-3.5 text-mute">{pending ? money(pending) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
