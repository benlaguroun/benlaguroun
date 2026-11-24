import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ProjectForm } from "@/components/admin/project-form";
import { deleteProject } from "../../project-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditProjectPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { id } = await params;
  const { error, saved } = await searchParams;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <Link href={`/${locale}/admin/projects`} className="text-sm text-mute hover:text-ink">← All projects</Link>
      <div className="mt-4">
        <AdminHeading title={project.title}>
          <Link href={`/${locale}/portfolio/${project.slug}`} target="_blank" className="btn btn-glass !px-4 !py-2">View on site</Link>
        </AdminHeading>
      </div>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      <ProjectForm locale={locale} project={project} />

      <form action={deleteProject} className="mt-10 border-t border-line pt-6">
        <input type="hidden" name="id" value={project.id} />
        <input type="hidden" name="locale" value={locale} />
        <ConfirmButton message={`Delete “${project.title}” for good? This can't be undone.`}>Delete project</ConfirmButton>
      </form>
    </>
  );
}
