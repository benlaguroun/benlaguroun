import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { PageIntro } from "@/components/section-heading";

// Built once, then reused for 10 minutes. Saving anything in the admin refreshes it straight away.
export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDict(locale).pages.portfolio;
  return pageMetadata({ locale, path: "/portfolio", title: t.eyebrow, description: t.body });
}

export default async function PortfolioPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale).pages.portfolio;
  const projects = await prisma.project.findMany({ orderBy: [{ position: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.title} body={t.body} />
      <div className="wrap grid gap-5 py-16 md:grid-cols-2">
        {projects.map((raw, i) => {
          const p = localize(raw, locale);
          return (
            <Reveal key={p.id} delay={(i % 2) * 100}>
              <Link href={lp(locale, `/portfolio/${p.slug}`)} className="glass spot block h-full p-8">
                <span className="deco -end-10 -top-10 h-36 w-36 rounded-full bg-iris/25 blur-3xl" />
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" loading="lazy" className="mb-6 aspect-video w-full rounded-xl border border-line object-cover" />
                )}
                {p.client && <p className="eyebrow">{p.client}</p>}
                <h2 className="display mt-3 text-2xl font-semibold">{p.title}</h2>
                <p className="mt-3 leading-relaxed text-mute">{p.summary}</p>
                <div className="mt-6 flex flex-wrap gap-1.5" dir="ltr">
                  {p.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
