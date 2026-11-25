import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Filters, StatCard } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ range?: string }>;
};

type Row = { label: string; n: number };

/** A ranked list with a bar behind each line. */
function BarList({ title, rows, empty = "Nothing yet." }: { title: string; rows: Row[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <section className="glass p-5">
      <h2 className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-mute">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="relative overflow-hidden rounded-lg">
              <span aria-hidden className="absolute inset-y-0 start-0 rounded-lg bg-iris/20" style={{ width: `${(r.n / max) * 100}%` }} />
              <span className="relative flex items-center justify-between gap-3 px-3 py-1.5 text-sm">
                <span className="truncate" dir="auto">{r.label}</span>
                <span className="shrink-0 font-mono text-xs text-mute">{r.n}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function countryName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export default async function AdminAnalyticsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { range } = await searchParams;
  const days = RANGES.find((r) => String(r) === range) ?? 30;

  const now = new Date();
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1)));
  const inRange = { createdAt: { gte: since } };

  // The eight most common values of one column, as { key, n }.
  const top = async (by: "path" | "referrer" | "country" | "device" | "locale", extra: object = {}) => {
    const found = (await prisma.pageView.groupBy({
      by: [by],
      where: { ...inRange, ...extra },
      _count: { _all: true },
      orderBy: { _count: { [by]: "desc" } },
      take: 8,
    } as never)) as unknown as Record<string, unknown>[];
    return found.map((r) => ({ key: String(r[by] ?? ""), n: Number((r._count as { _all: number })._all) }));
  };

  const [views, daily, pages, referrers, countries, devices, languages, productViews, checkoutVisits, paidOrders] = await Promise.all([
    prisma.pageView.count({ where: inRange }),
    prisma.$queryRaw<{ d: Date; views: number; visitors: number }[]>`
      SELECT date_trunc('day', "createdAt") AS d, count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
      FROM "PageView" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 1`,
    top("path"),
    top("referrer", { referrer: { not: null } }),
    top("country", { country: { not: null } }),
    top("device"),
    top("locale"),
    prisma.pageView.count({
      where: { ...inRange, OR: [{ path: { startsWith: "/services/" } }, { path: { startsWith: "/templates/" } }, { path: { startsWith: "/courses/" } }] },
    }),
    prisma.pageView.count({
      where: { ...inRange, AND: [{ path: { startsWith: "/checkout/" } }, { NOT: { path: { startsWith: "/checkout/success" } } }] },
    }),
    prisma.order.count({ where: { status: "PAID", paidAt: { gte: since } } }),
  ]);

  // One bar per day, including days with no visits.
  const byDay = new Map((daily as { d: Date; views: number; visitors: number }[]).map((r) => [r.d.toISOString().slice(0, 10), r]));
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(since.getTime() + i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    return { key, views: byDay.get(key)?.views ?? 0, visitors: byDay.get(key)?.visitors ?? 0 };
  });
  const visitorDays = series.reduce((n, r) => n + r.visitors, 0);
  const maxViews = Math.max(1, ...series.map((r) => r.views));

  const rows = (list: { key: string; n: number }[], label: (key: string) => string = (k) => k): Row[] =>
    list.map((r) => ({ label: label(r.key), n: r.n }));

  const base = `/${locale}/admin/analytics`;

  return (
    <>
      <AdminHeading title="Analytics" />
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Visits to your public pages, counted by your own server. No cookies, no IP addresses stored, and your own visits from this
        browser are left out. Crawlers and bots are ignored.
      </p>

      <Filters
        current={String(days)}
        items={RANGES.map((r) => ({ key: String(r), label: `Last ${r} days`, href: r === 30 ? base : `${base}?range=${r}` }))}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Page views" value={String(views)} />
        <StatCard label="Daily visitors" value={String(visitorDays)} hint="Each person is counted once per day" />
        <StatCard label="Product page views" value={String(productViews)} hint="Services, templates and courses" />
        <StatCard
          label="Checkout → paid"
          value={`${checkoutVisits} → ${paidOrders}`}
          hint={checkoutVisits ? `${Math.round((paidOrders / checkoutVisits) * 100)}% of checkout visits ended in a sale` : "Checkout visits, then paid orders"}
        />
      </div>

      <section className="glass mb-6 p-5">
        <h2 className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">Page views per day</h2>
        <div className="mt-5 flex h-40 items-end gap-[3px]" role="img" aria-label={`Page views per day over the last ${days} days`}>
          {series.map((r) => (
            <div key={r.key} className="group relative flex h-full flex-1 items-end" title={`${r.key}: ${r.views} views, ${r.visitors} visitors`}>
              <div
                className="w-full rounded-t bg-gradient-to-t from-iris to-aqua opacity-80 transition group-hover:opacity-100"
                style={{ height: `${Math.max(r.views ? 4 : 1, (r.views / maxViews) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-mute" dir="ltr">
          <span>{series[0]?.key}</span>
          <span>{series[series.length - 1]?.key}</span>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarList title="Top pages" rows={rows(pages)} empty="No visits recorded yet." />
        <BarList title="Where visitors come from" rows={rows(referrers)} empty="No referring sites yet. Direct visits aren't listed." />
        <BarList title="Countries" rows={rows(countries, countryName)} empty="Country is available when the site runs behind Cloudflare." />
        <div className="grid gap-4 sm:grid-cols-2">
          <BarList title="Devices" rows={rows(devices)} />
          <BarList title="Languages" rows={rows(languages, (k) => k.toUpperCase())} />
        </div>
      </div>
    </>
  );
}
