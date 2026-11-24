import Link from "next/link";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDate } from "@/lib/admin-format";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, ErrorBanner, Pill } from "@/components/admin/ui";
import { setPostPublished } from "../post-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminPostsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error, saved } = await searchParams;

  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  const base = `/${locale}/admin/posts`;

  return (
    <>
      <AdminHeading title="Blog">
        <Link href={`${base}/new`} className="btn btn-primary !px-4 !py-2">New article</Link>
      </AdminHeading>
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Articles bring in search traffic. Write about problems your clients have, with real examples from your projects.
        Drafts stay hidden until you publish them.
      </p>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      {posts.length === 0 ? (
        <Empty>No articles yet. Write the first one.</Empty>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="glass flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`${base}/${p.id}`} className="font-medium hover:text-aqua">{p.title}</Link>
                  <Pill tone={p.published ? "good" : "warn"}>{p.published ? "published" : "draft"}</Pill>
                </div>
                <p className="mt-1 text-sm text-mute">
                  {p.publishedAt ? `Published ${fmtDate(p.publishedAt)}` : `Created ${fmtDate(p.createdAt)}`}
                  {p.tags.length > 0 && ` · ${p.tags.join(", ")}`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {p.published && (
                  <Link href={`/${locale}/blog/${p.slug}`} target="_blank" className="btn btn-glass !px-4 !py-2">View</Link>
                )}
                <form action={setPostPublished}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="published" value={p.published ? "0" : "1"} />
                  <button type="submit" className="btn btn-glass !px-4 !py-2">{p.published ? "Unpublish" : "Publish"}</button>
                </form>
                <Link href={`${base}/${p.id}`} className="btn btn-primary !px-4 !py-2">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
