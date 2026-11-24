import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDate } from "@/lib/admin-format";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, Filters, Pill, StatCard } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteSubscriber } from "../catalog-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ show?: string }>;
};

export default async function AdminSubscribersPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { show } = await searchParams;
  const filter = show === "unsubscribed" ? "unsubscribed" : "active";

  const [active, unsubscribed, rows] = await Promise.all([
    prisma.subscriber.count({ where: { active: true } }),
    prisma.subscriber.count({ where: { active: false } }),
    prisma.subscriber.findMany({
      where: { active: filter === "active" },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
  ]);

  const base = `/${locale}/admin/subscribers`;

  return (
    <>
      <AdminHeading title="Subscribers">
        <a href="/api/admin/subscribers" className="btn btn-glass !px-4 !py-2">Download CSV</a>
      </AdminHeading>
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        People who signed up in the footer. Download the list as a CSV to import into Brevo, Mailchimp or any newsletter tool and send from there.
        Only active subscribers are in the download, so nobody who unsubscribed gets mail by accident.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Active" value={String(active)} />
        <StatCard label="Unsubscribed" value={String(unsubscribed)} />
      </div>

      <Filters
        current={filter}
        items={[
          { key: "active", label: "Active", href: base },
          { key: "unsubscribed", label: "Unsubscribed", href: `${base}?show=unsubscribed` },
        ]}
      />

      {rows.length === 0 ? (
        <Empty>{filter === "active" ? "No subscribers yet." : "Nobody has unsubscribed."}</Empty>
      ) : (
        <div className="glass overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-start font-mono text-[0.68rem] uppercase tracking-wider text-mute">
                <th className="px-5 py-3 text-start font-medium">Email</th>
                <th className="px-5 py-3 text-start font-medium">Language</th>
                <th className="px-5 py-3 text-start font-medium">{filter === "active" ? "Joined" : "Left"}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3" dir="ltr">{s.email}</td>
                  <td className="px-5 py-3"><Pill>{s.locale}</Pill></td>
                  <td className="px-5 py-3 text-mute">{fmtDate(filter === "active" ? s.createdAt : s.unsubscribedAt)}</td>
                  <td className="px-5 py-3 text-end">
                    <form action={deleteSubscriber}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <ConfirmButton message={`Remove ${s.email} from the list for good?`} className="text-xs text-rose hover:underline">
                        Remove
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
