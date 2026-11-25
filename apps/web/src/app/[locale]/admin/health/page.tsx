import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { runLiveChecks, type Check } from "@/lib/live-check";
import { siteUrl } from "@/lib/site-url";
import { AdminHeading, Pill } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

const tone = { ok: "good", warn: "warn", fail: "bad" } as const;
const word = { ok: "OK", warn: "Check", fail: "Problem" } as const;
const order = ["Address", "Reachability", "Server", "Email", "Payments", "Assistant"];

export default async function AdminHealthPage({ params }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);

  const started = new Date();
  const checks = await runLiveChecks();
  const fails = checks.filter((c) => c.status === "fail").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const groups = order.map((g) => ({ name: g, items: checks.filter((c) => c.group === g) })).filter((g) => g.items.length);

  return (
    <>
      <AdminHeading title="Live check">
        <Link href={`/${locale}/admin/health`} className="btn btn-glass !px-4 !py-2">Run again</Link>
      </AdminHeading>
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        The site tests itself the way a visitor would reach it: out to <span dir="ltr" className="font-mono">{siteUrl}</span> and back through Cloudflare and your tunnel. Problems come with the fix.
        Run it after every deploy.
      </p>

      <div className="glass mb-8 flex flex-wrap items-center gap-3 p-5">
        <Pill tone={fails ? "bad" : warns ? "warn" : "good"}>{fails ? `${fails} problem${fails === 1 ? "" : "s"}` : warns ? "Works, with things to check" : "All good"}</Pill>
        <span className="text-sm text-mute">
          {checks.length - fails - warns} OK · {warns} to check · {fails} problem{fails === 1 ? "" : "s"} · ran {started.toISOString().slice(11, 19)} UTC
        </span>
      </div>

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.name} aria-labelledby={`g-${g.name}`}>
            <h2 id={`g-${g.name}`} className="display mb-3 text-lg font-semibold">{g.name}</h2>
            <ul className="space-y-2">
              {g.items.map((c) => (
                <Row key={c.id} c={c} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-sm text-mute">
        To be told when the site goes down, add a free uptime monitor (UptimeRobot or Better Stack) on{" "}
        <span dir="ltr" className="font-mono">{siteUrl}/api/health</span> every 5 minutes. It answers 200 when the site and database are up and 503 when they are not.
      </p>
    </>
  );
}

function Row({ c }: { c: Check }) {
  return (
    <li className="glass p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={tone[c.status]}>{word[c.status]}</Pill>
        <p className="font-medium">{c.label}</p>
      </div>
      <p className="mt-2 text-sm text-mute" dir="auto">{c.detail}</p>
      {c.fix && c.status !== "ok" && <p className="mt-1 text-sm text-amber-200"><strong>Fix:</strong> {c.fix}</p>}
    </li>
  );
}
