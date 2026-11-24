import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { localeMeta, lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { readingMinutes } from "@/lib/markdown";
import { pageMetadata } from "@/lib/seo";
import { Arrow } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { PageIntro } from "@/components/section-heading";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const b = getDict(locale).blog;
  return pageMetadata({ locale, path: "/blog", title: b.eyebrow, description: b.body });
}

export default async function BlogPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const b = t.blog;

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  const fmt = new Intl.DateTimeFormat(localeMeta[locale].intl, { dateStyle: "long" });

  return (
    <>
      <PageIntro eyebrow={b.eyebrow} title={b.title} body={b.body} />
      <section className="wrap py-14">
        {posts.length === 0 ? (
          <div className="glass p-12 text-center text-mute">{b.empty}</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((raw, i) => {
              const p = localize(raw, locale);
              return (
                <Reveal key={p.id} delay={(i % 2) * 100}>
                  <Link href={lp(locale, `/blog/${p.slug}`)} className="glass spot flex h-full flex-col p-7">
                    <p className="font-mono text-xs text-mute">
                      {p.publishedAt ? fmt.format(p.publishedAt) : ""} · {fill(b.minRead, { n: readingMinutes(p.body) })}
                    </p>
                    <h2 className="display mt-3 text-2xl font-semibold">{p.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{p.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5" dir="ltr">
                        {p.tags.slice(0, 3).map((tag) => <span key={tag} className="chip">{tag}</span>)}
                      </div>
                      <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-aqua">
                        {b.readMore} <Arrow />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
