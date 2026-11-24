import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { paragraphs } from "@/lib/format";
import { ArrowBack } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const raw = await prisma.project.findUnique({ where: { slug } });
  if (!raw) return {};
  const p = localize(raw, locale);
  return { title: p.title, description: p.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const raw = await prisma.project.findUnique({ where: { slug } });
  if (!raw) notFound();
  const project = localize(raw, locale);

  return (
    <article className="wrap max-w-3xl py-14">
      <Reveal>
        <Link href={lp(locale, "/portfolio")} className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink">
          <ArrowBack /> {t.project.back}
        </Link>
        {project.client && <p className="eyebrow mt-8">{project.client}</p>}
        <h1 className="display mt-3 text-4xl font-semibold sm:text-6xl">
          <span className="text-gradient">{project.title}</span>
        </h1>
        <p className="mt-5 text-xl text-mute">{project.summary}</p>
        <div className="mt-6 flex flex-wrap gap-1.5" dir="ltr">
          {project.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
        <div className="mt-10 space-y-4 text-lg leading-relaxed">
          {paragraphs(project.body).map((para, i) => <p key={i}>{para}</p>)}
        </div>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-glass mt-8">
            {t.project.visit} ↗
          </a>
        )}
      </Reveal>

      <Reveal delay={100}>
        <div className="glass mt-16 p-8">
          <p className="display text-2xl font-semibold">{t.project.want}</p>
          <Link href={lp(locale, "/contact")} className="btn btn-primary mt-5">{t.project.start}</Link>
        </div>
      </Reveal>
    </article>
  );
}
