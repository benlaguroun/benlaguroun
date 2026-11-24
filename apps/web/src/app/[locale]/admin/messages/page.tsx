import Link from "next/link";
import { prisma, type LeadStatus } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDate } from "@/lib/admin-format";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, Filters, Pill, leadTone } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const STATUSES: LeadStatus[] = ["NEW", "READ", "REPLIED", "ARCHIVED"];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function MessagesPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { status } = await searchParams;
  const filter = STATUSES.find((s) => s === status);

  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({
      // Archived messages stay out of the way unless you ask for them.
      where: filter ? { status: filter } : { status: { not: "ARCHIVED" } },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { client: { select: { id: true, name: true } } },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: true }),
  ]);
  const count = (s: LeadStatus) => counts.find((c) => c.status === s)?._count ?? 0;
  const base = `/${locale}/admin/messages`;

  return (
    <>
      <AdminHeading title="Messages" />
      <Filters
        current={filter ?? "all"}
        items={[
          { key: "all", label: "Inbox", href: base },
          ...STATUSES.map((s) => ({
            key: s,
            label: `${s.charAt(0)}${s.slice(1).toLowerCase()} (${count(s)})`,
            href: `${base}?status=${s}`,
          })),
        ]}
      />

      {leads.length === 0 ? (
        <Empty>Nothing here. New contact form messages will show up in this list.</Empty>
      ) : (
        <ul className="glass divide-y divide-line">
          {leads.map((l) => (
            <li key={l.id}>
              <Link href={`${base}/${l.id}`} className="flex items-start justify-between gap-4 px-5 py-4 transition hover:bg-white/5">
                <span className="min-w-0">
                  <span className={`block text-sm ${l.status === "NEW" ? "font-semibold" : "font-medium"}`}>
                    {l.name} <span className="font-normal text-mute" dir="ltr">&lt;{l.email}&gt;</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm text-mute">{l.message}</span>
                  <span className="mt-2 flex flex-wrap gap-2">
                    {l.interest && <Pill>{l.interest}</Pill>}
                    {l.budget && <Pill>{l.budget}</Pill>}
                    {l.client && <Pill tone="good">client: {l.client.name}</Pill>}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-2">
                  <Pill tone={leadTone[l.status]}>{l.status.toLowerCase()}</Pill>
                  <span className="text-xs text-mute">{fmtDate(l.createdAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
