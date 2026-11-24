import Link from "next/link";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, ErrorBanner, Pill } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminProjectsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error, saved } = await searchParams;

  const projects = await prisma.project.findMany({ orderBy: [{ position: "asc" }, { createdAt: "desc" }] });
  const base = `/${locale}/admin/projects`;

  return (
    <>
      <AdminHeading title="Projects">
        <Link href={`${base}/new`} className="btn btn-primary !px-4 !py-2">New project</Link>
      </AdminHeading>
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Your portfolio. A project with screenshots and a live demo convinces far more than text alone, so add both wherever you can.
      </p>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      {projects.length === 0 ? (
        <Empty>No projects yet. Add your first one.</Empty>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id} className="glass flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-center gap-4">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className="h-14 w-24 shrink-0 rounded-lg border border-line object-cover" />
                ) : (
                  <span className="grid h-14 w-24 shrink-0 place-items-center rounded-lg border border-dashed border-line text-[0.65rem] text-mute">no cover</span>
                )}
                <div className="min-w-0">
                  <Link href={`${base}/${p.id}`} className="font-medium hover:text-aqua">{p.title}</Link>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Pill tone={p.liveUrl ? "good" : "neutral"}>{p.liveUrl ? "demo link" : "no demo link"}</Pill>
                    <Pill tone={p.images.length ? "good" : "neutral"}>{p.images.length} screenshot{p.images.length === 1 ? "" : "s"}</Pill>
                    {p.featured && <Pill tone="info">featured</Pill>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/${locale}/portfolio/${p.slug}`} target="_blank" className="btn btn-glass !px-4 !py-2">View</Link>
                <Link href={`${base}/${p.id}`} className="btn btn-primary !px-4 !py-2">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
