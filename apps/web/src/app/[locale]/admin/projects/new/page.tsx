import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function NewProjectPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error } = await searchParams;

  return (
    <>
      <Link href={`/${locale}/admin/projects`} className="text-sm text-mute hover:text-ink">← All projects</Link>
      <div className="mt-4">
        <AdminHeading title="New project" />
      </div>
      <ErrorBanner message={error} />
      <ProjectForm locale={locale} />
    </>
  );
}
