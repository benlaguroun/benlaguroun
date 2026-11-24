import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, type LeadStatus } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDateTime } from "@/lib/admin-format";
import { resolveLocale } from "@/i18n/resolve";
import { convertLeadToClient, deleteLead, setLeadStatus } from "../../actions";
import { AdminHeading, Pill, leadTone } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; id: string }> };

function StatusButton({
  id,
  status,
  locale,
  label,
  current,
}: {
  id: string;
  status: LeadStatus;
  locale: string;
  label: string;
  current: LeadStatus;
}) {
  return (
    <form action={setLeadStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="returnTo" value={`/${locale}/admin/messages/${id}`} />
      <button type="submit" disabled={current === status} className="btn btn-glass !px-4 !py-2 text-xs">
        {label}
      </button>
    </form>
  );
}

export default async function MessagePage({ params }: Props) {
  const { id } = await params;
  const locale = await resolveLocale(params);
  await requireAdmin(locale);

  let lead = await prisma.lead.findUnique({ where: { id }, include: { client: true } });
  if (!lead) notFound();

  // Opening a message marks it as read.
  if (lead.status === "NEW") {
    lead = await prisma.lead.update({ where: { id }, data: { status: "READ" }, include: { client: true } });
  }

  const subject = encodeURIComponent("Re: your message");
  const body = encodeURIComponent(`Hi ${lead.name.split(" ")[0]},\n\nThanks for getting in touch.\n\n`);

  return (
    <>
      <Link href={`/${locale}/admin/messages`} className="text-sm text-mute hover:text-ink">← All messages</Link>
      <div className="mt-4">
        <AdminHeading title={lead.name}>
          <Pill tone={leadTone[lead.status]}>{lead.status.toLowerCase()}</Pill>
        </AdminHeading>
      </div>

      <div className="glass space-y-6 p-7">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">Email</dt>
            <dd className="mt-1" dir="ltr">
              <a href={`mailto:${lead.email}`} className="text-aqua hover:underline">{lead.email}</a>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">Received</dt>
            <dd className="mt-1">{fmtDateTime(lead.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">Interested in</dt>
            <dd className="mt-1">{lead.interest ?? "Not specified"}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">Budget</dt>
            <dd className="mt-1">{lead.budget ?? "Not specified"}</dd>
          </div>
        </dl>

        <div className="border-t border-line pt-6">
          <p className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">Message</p>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed">{lead.message}</p>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line pt-6">
          <a
            href={`mailto:${lead.email}?subject=${subject}&body=${body}`}
            className="btn btn-primary !px-4 !py-2 text-xs"
          >
            Reply by email
          </a>
          <StatusButton id={lead.id} status="REPLIED" locale={locale} label="Mark as replied" current={lead.status} />
          <StatusButton id={lead.id} status="ARCHIVED" locale={locale} label="Archive" current={lead.status} />
          {lead.status !== "READ" && lead.status !== "NEW" && (
            <StatusButton id={lead.id} status="READ" locale={locale} label="Mark as unread/read" current={lead.status} />
          )}
        </div>
      </div>

      <div className="glass mt-5 flex flex-wrap items-center justify-between gap-4 p-6">
        {lead.client ? (
          <p className="text-sm">
            Linked to client{" "}
            <Link href={`/${locale}/admin/clients/${lead.client.id}`} className="font-semibold text-aqua hover:underline">
              {lead.client.name}
            </Link>
          </p>
        ) : (
          <>
            <p className="text-sm text-mute">Turn this person into a client to track notes and payments.</p>
            <form action={convertLeadToClient}>
              <input type="hidden" name="id" value={lead.id} />
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-glass !px-4 !py-2 text-xs">Convert to client</button>
            </form>
          </>
        )}
      </div>

      <form action={deleteLead} className="mt-5 text-end">
        <input type="hidden" name="id" value={lead.id} />
        <input type="hidden" name="locale" value={locale} />
        <button type="submit" className="text-xs font-medium text-rose hover:underline">Delete this message permanently</button>
      </form>
    </>
  );
}
