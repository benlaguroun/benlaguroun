import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function NewPostPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error } = await searchParams;

  return (
    <>
      <Link href={`/${locale}/admin/posts`} className="text-sm text-mute hover:text-ink">← All articles</Link>
      <div className="mt-4">
        <AdminHeading title="New article" />
      </div>
      <ErrorBanner message={error} />
      <PostForm locale={locale} />
    </>
  );
}
