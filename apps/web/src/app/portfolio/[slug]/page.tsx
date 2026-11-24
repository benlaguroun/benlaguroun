import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { paragraphs } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.project.findUnique({ where: { slug } });
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  return (
    <article className="wrap max-w-3xl py-14">
      <Link href="/portfolio" className="text-sm text-muted hover:text-ink">← All work</Link>
      {project.client && <p className="eyebrow mt-6">{project.client}</p>}
      <h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">{project.title}</h1>
      <p className="mt-4 text-xl text-muted">{project.summary}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((t) => <span key={t} className="chip">{t}</span>)}
      </div>
      <div className="mt-10 space-y-4 text-lg leading-relaxed">
        {paragraphs(project.body).map((para, i) => <p key={i}>{para}</p>)}
      </div>
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-8">Visit live site ↗</a>
      )}
      <div className="mt-14 rounded-2xl bg-accent-soft p-7">
        <p className="display text-xl font-semibold">Want something similar?</p>
        <Link href="/contact" className="btn-primary mt-4">Start a project</Link>
      </div>
    </article>
  );
}
