import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { localeMeta, lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { readingMinutes, renderMarkdown } from "@/lib/markdown";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, pathFor } from "@/lib/seo";
import { Arrow, ArrowBack } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { Reveal } from "@/components/reveal";

// Built once, then reused for 10 minutes. Saving anything in the admin refreshes it straight away.
export const revalidate = 600;

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({ where: { slug } });
  return post && post.published ? post : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const raw = await getPost(slug);
  if (!raw) return {};
  const p = localize(raw, locale);
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: p.title,
    description: p.excerpt,
    type: "article",
    image: p.coverUrl ?? undefined,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const raw = await getPost(slug);
  if (!raw) notFound();
  const post = localize(raw, locale);
  const fmt = new Intl.DateTimeFormat(localeMeta[locale].intl, { dateStyle: "long" });
  const url = absoluteUrl(pathFor(locale, `/blog/${slug}`));

  return (
    <article className="wrap max-w-3xl py-14">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            url,
            mainEntityOfPage: url,
            inLanguage: locale,
            keywords: post.tags.join(", "),
            ...(post.publishedAt ? { datePublished: post.publishedAt.toISOString() } : {}),
            dateModified: post.updatedAt.toISOString(),
            ...(post.coverUrl ? { image: post.coverUrl } : {}),
            author: { "@type": "Person", name: site.name, url: absoluteUrl("") },
          },
          breadcrumbJsonLd(locale, [
            { name: t.blog.eyebrow, path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />

      <Reveal>
        <Link href={lp(locale, "/blog")} className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink">
          <ArrowBack /> {t.blog.back}
        </Link>
        <p className="mt-8 font-mono text-xs text-mute">
          {post.publishedAt ? fmt.format(post.publishedAt) : ""} · {fill(t.blog.minRead, { n: readingMinutes(post.body) })}
        </p>
        <h1 className="display mt-3 text-4xl font-semibold sm:text-5xl">
          <span className="text-gradient">{post.title}</span>
        </h1>
        <p className="mt-5 text-lg text-mute">{post.excerpt}</p>
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5" dir="ltr">
            {post.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
          </div>
        )}
      </Reveal>

      {post.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverUrl} alt="" className="mt-10 w-full rounded-2xl border border-line" />
      )}

      <div className="mt-10 space-y-5 text-lg leading-relaxed" dir="auto">{renderMarkdown(post.body)}</div>

      <div className="glass mt-16 p-8 text-center">
        <p className="display text-2xl font-semibold">{t.blog.cta.title}</p>
        <p className="mx-auto mt-2 max-w-md text-mute">{t.blog.cta.body}</p>
        <Link href={lp(locale, "/contact")} className="btn btn-primary mt-6">
          {t.blog.cta.button} <Arrow />
        </Link>
      </div>

      <div className="mt-10">
        <p className="display text-lg font-semibold">{t.newsletter.title}</p>
        <p className="mb-4 mt-1 text-sm text-mute">{t.newsletter.body}</p>
        <NewsletterForm locale={locale} t={t.newsletter} />
      </div>
    </article>
  );
}
