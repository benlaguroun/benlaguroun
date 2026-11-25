import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { lp } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { loadRoadmap, phases, type Item, type Kind } from "@/lib/roadmap";
import { AdminHeading, Pill } from "@/components/admin/ui";
import { setRoadmapItem } from "../roadmap-actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ show?: string }> };

const kindLabel: Record<Kind, string> = { setup: "Setup", business: "Business", code: "Code task" };

export default async function AdminRoadmapPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { show } = await searchParams;
  const onlyOpen = show === "open";

  const { items, needsPush } = await loadRoadmap();
  const total = items.length;
  const done = items.filter((i) => i.status === "done").length;
  const action = items.filter((i) => i.status === "action");
  const waiting = items.filter((i) => i.status === "waiting").length;
  const pct = Math.round((done / total) * 100);
  const next = action.slice(0, 5);
  const base = `/${locale}/admin/roadmap`;

  return (
    <>
      <AdminHeading title="Roadmap" />
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Your plan from ROADMAP.md. Steps the site can check by itself tick automatically. The rest you tick by hand when you have done them.
        A step marked <em>waiting</em> cannot start until the step it depends on is finished.
      </p>

      {needsPush && (
        <p role="alert" className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
          Ticking steps by hand needs one database update. Run <code>npm run db:generate</code> and <code>npm run db:push</code>, then reload this page.
        </p>
      )}

      <div className="glass mb-8 p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="display text-4xl font-semibold">{pct}%</p>
            <p className="text-sm text-mute">
              {done} of {total} steps done · {action.length} need action · {waiting} waiting
            </p>
          </div>
          <Link href={onlyOpen ? base : `${base}?show=open`} className="btn btn-glass !px-4 !py-2">
            {onlyOpen ? "Show everything" : "Hide finished steps"}
          </Link>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Roadmap progress"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full rounded-full bg-aqua" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {next.length > 0 && (
        <section className="mb-10" aria-labelledby="next-actions">
          <h2 id="next-actions" className="display mb-3 text-lg font-semibold">Do next</h2>
          <ul className="space-y-2">
            {next.map((i) => (
              <li key={i.key}>
                <a href={`#${i.key}`} className="glass flex items-center justify-between gap-3 px-4 py-3 text-sm transition hover:bg-white/8">
                  <span className="min-w-0 font-medium">{i.title}</span>
                  <Pill tone="warn">{kindLabel[i.kind]}</Pill>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="space-y-10">
        {phases.map((p) => {
          const all = items.filter((i) => i.phase === p.id);
          const rows = onlyOpen ? all.filter((i) => i.status !== "done") : all;
          const d = all.filter((i) => i.status === "done").length;
          if (rows.length === 0) return null;
          return (
            <section key={p.id} aria-labelledby={p.id}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <h2 id={p.id} className="display text-lg font-semibold">{p.title}</h2>
                <span className="font-mono text-xs text-mute">{d}/{all.length}</span>
              </div>
              <p className="mb-3 text-sm text-mute">{p.blurb}</p>
              <ul className="space-y-2">
                {rows.map((i) => (
                  <Row key={i.key} item={i} locale={locale as Locale} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

function Row({ item: i, locale }: { item: Item; locale: Locale }) {
  const tone = i.status === "done" ? "good" : i.status === "waiting" ? "neutral" : "warn";
  const label = i.status === "done" ? "Done" : i.status === "waiting" ? "Waiting" : "Needs action";
  return (
    <li id={i.key} className={`glass scroll-mt-24 p-4 ${i.status === "done" ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={tone}>{label}</Pill>
            <Pill>{kindLabel[i.kind]}</Pill>
            {i.auto && <Pill tone="info">Auto-checked</Pill>}
          </div>
          <p className={`mt-2 font-medium ${i.status === "done" ? "line-through decoration-white/30" : ""}`}>{i.title}</p>
          <p className="mt-1 text-sm text-mute">{i.why}</p>
          {i.detail && <p className="mt-1 text-xs text-aqua" dir="ltr">{i.detail}</p>}
          {i.status === "waiting" && i.waitingFor && <p className="mt-1 text-xs text-mute">Waiting for: {i.waitingFor}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {i.href && i.status !== "done" && (
            <Link href={lp(locale, i.href)} className="btn btn-glass !px-4 !py-2">Open</Link>
          )}
          {!i.auto && (
            <form action={setRoadmapItem}>
              <input type="hidden" name="key" value={i.key} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="done" value={i.status === "done" ? "0" : "1"} />
              <button type="submit" className="btn btn-glass !px-4 !py-2">{i.status === "done" ? "Undo" : "Mark done"}</button>
            </form>
          )}
        </div>
      </div>
    </li>
  );
}
