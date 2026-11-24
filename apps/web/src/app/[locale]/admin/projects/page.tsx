import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, ErrorBanner, Pill } from "@/components/admin/ui";
import { updateProjectDemo } from "../actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminProjectsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error, saved } = await searchParams;

  const projects = await prisma.project.findMany({ orderBy: { position: "asc" } });

  return (
    <>
      <AdminHeading title="Projects" />
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Add a link to a live demo so clients can try the project. Projects without a link show a
        “Request a demo” button instead, which starts a message to you. Clear the box to remove a link.
      </p>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          Saved.
        </p>
      )}

      {projects.length === 0 ? (
        <Empty>No projects yet. Run the seed to add them.</Empty>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id} className="glass p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{p.title}</p>
                <Pill tone={p.liveUrl ? "good" : "neutral"}>{p.liveUrl ? "demo link set" : "no demo link"}</Pill>
              </div>
              <form action={updateProjectDemo} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="locale" value={locale} />
                <input
                  name="liveUrl"
                  defaultValue={p.liveUrl ?? ""}
                  placeholder="https://demo.example.com"
                  dir="ltr"
                  aria-label={`Demo link for ${p.title}`}
                  className="field flex-1"
                />
                <button type="submit" className="btn btn-glass !px-5">Save</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
