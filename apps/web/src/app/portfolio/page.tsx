import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { PageIntro } from "@/components/section-heading";

export const metadata: Metadata = { title: "Work" };
export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ position: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <PageIntro
        eyebrow="Selected work"
        title="Platforms and products I've built"
        body="Case studies from client projects and my own brands."
      />
      <div className="wrap grid gap-5 py-14 md:grid-cols-2">
        {projects.map((p) => (
          <Link key={p.id} href={`/portfolio/${p.slug}`} className="card group p-7 transition hover:border-ink">
            {p.client && <p className="text-xs font-semibold uppercase tracking-wider text-muted">{p.client}</p>}
            <h2 className="display mt-2 text-2xl font-semibold">{p.title}</h2>
            <p className="mt-2 text-muted">{p.summary}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
