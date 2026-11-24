import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner, Pill } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PostForm } from "@/components/admin/post-form";
import { deletePost } from "../../post-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditPostPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { id } = await params;
  const { error, saved } = await searchParams;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <Link href={`/${locale}/admin/posts`} className="text-sm text-mute hover:text-ink">← All articles</Link>
      <div className="mt-4">
        <AdminHeading title={post.title}>
          <Pill tone={post.published ? "good" : "warn"}>{post.published ? "published" : "draft"}</Pill>
          {post.published && (
            <Link href={`/${locale}/blog/${post.slug}`} target="_blank" className="btn btn-glass !px-4 !py-2">View on site</Link>
          )}
        </AdminHeading>
      </div>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      <PostForm locale={locale} post={post} />

      <form action={deletePost} className="mt-10 border-t border-line pt-6">
        <input type="hidden" name="id" value={post.id} />
        <input type="hidden" name="locale" value={locale} />
        <ConfirmButton message={`Delete “${post.title}” for good? This can't be undone.`}>Delete article</ConfirmButton>
      </form>
    </>
  );
}
