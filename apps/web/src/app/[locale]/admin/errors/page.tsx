import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDateTime } from "@/lib/admin-format";
import { emailConfigured } from "@/lib/email";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, Filters, Pill } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteResolvedErrors, resolveAllErrors, resolveError } from "../error-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ show?: string }>;
};

const tone = { payment: "bad", webhook: "bad", email: "warn", server: "warn" } as const;

export default async function AdminErrorsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { show } = await searchParams;
  const filter = show === "resolved" ? "resolved" : "open";

  const [open, resolved, rows] = await Promise.all([
    prisma.errorLog.count({ where: { resolved: false } }),
    prisma.errorLog.count({ where: { resolved: true } }),
    prisma.errorLog.findMany({
      where: { resolved: filter === "resolved" },
      orderBy: { lastSeen: "desc" },
      take: 100,
    }),
  ]);

  const base = `/${locale}/admin/errors`;

  return (
    <>
      <AdminHeading title="Errors">
        {filter === "open" && open > 0 && (
          <form action={resolveAllErrors}>
            <input type="hidden" name="locale" value={locale} />
            <button type="submit" className="btn btn-glass !px-4 !py-2">Mark all as resolved</button>
          </form>
        )}
        {filter === "resolved" && resolved > 0 && (
          <form action={deleteResolvedErrors}>
            <input type="hidden" name="locale" value={locale} />
            <ConfirmButton message="Delete all resolved errors?">Clear resolved</ConfirmButton>
          </form>
        )}
      </AdminHeading>
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Problems the site ran into, such as a payment that couldn't be confirmed or a page that crashed. The same problem is listed once
        with a counter. {emailConfigured()
          ? "You also get an email, at most one an hour for each problem."
          : "Email alerts are off until you set up Brevo (BREVO_API_KEY and EMAIL_FROM), so check this page after launching."}
      </p>

      <Filters
        current={filter}
        items={[
          { key: "open", label: `Open (${open})`, href: base },
          { key: "resolved", label: `Resolved (${resolved})`, href: `${base}?show=resolved` },
        ]}
      />

      {rows.length === 0 ? (
        <Empty>{filter === "open" ? "No open errors. All quiet." : "Nothing resolved yet."}</Empty>
      ) : (
        <ul className="space-y-3">
          {rows.map((e) => (
            <li key={e.id} className="glass p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={tone[e.source as keyof typeof tone] ?? "neutral"}>{e.source}</Pill>
                    <Pill>{e.count}× </Pill>
                  </div>
                  <p className="mt-2 break-words font-medium" dir="ltr">{e.message}</p>
                  <p className="mt-1 text-xs text-mute">
                    {e.path && <span dir="ltr">{e.path} · </span>}
                    last {fmtDateTime(e.lastSeen)} · first {fmtDateTime(e.firstSeen)}
                  </p>
                </div>
                {!e.resolved && (
                  <form action={resolveError}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <button type="submit" className="btn btn-glass !px-4 !py-2">Mark resolved</button>
                  </form>
                )}
              </div>
              {e.stack && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-aqua">Technical details</summary>
                  <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-black/40 p-3 text-xs leading-relaxed" dir="ltr">{e.stack}</pre>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
