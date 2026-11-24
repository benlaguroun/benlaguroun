import Link from "next/link";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, templates, courses, projects] = await Promise.all([
    prisma.product.findMany({ where: { type: "SERVICE", published: true }, orderBy: { position: "asc" }, take: 3 }),
    prisma.product.findMany({ where: { type: "TEMPLATE", published: true }, orderBy: { position: "asc" }, take: 3 }),
    prisma.product.findMany({ where: { type: "COURSE", published: true }, orderBy: { position: "asc" }, take: 3 }),
    prisma.project.findMany({ where: { featured: true }, orderBy: { position: "asc" }, take: 3 }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="wrap grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">{site.founder} · Independent developer</p>
            <h1 className="display mt-4 text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Build it. Launch it. <span className="text-accent">Grow it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{site.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary">Work with me</Link>
              <Link href="/courses" className="btn-ghost">Learn the business side</Link>
            </div>
          </div>

          <div className="card grid grid-cols-3 divide-x divide-line text-center">
            {[
              ["Services", "Custom builds"],
              ["Templates", "Ship faster"],
              ["Courses", "Learn by doing"],
            ].map(([a, b]) => (
              <div key={a} className="px-3 py-8">
                <p className="display text-xl font-semibold">{a}</p>
                <p className="mt-1 text-xs text-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="wrap pt-20">
          <SectionHeading
            eyebrow="Services"
            title="Work with me directly"
            body="From a fast launch site to a full multi-user platform."
            href="/services"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Courses */}
      {courses.length > 0 && (
        <section className="wrap pt-20">
          <SectionHeading
            eyebrow="Courses"
            title="Learn how to build a business online"
            body="Practical, step-by-step lessons with worksheets you can use today."
            href="/courses"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {courses.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Templates */}
      {templates.length > 0 && (
        <section className="wrap pt-20">
          <SectionHeading
            eyebrow="Templates"
            title="Skip the blank page"
            body="Production-ready starters and worksheets, built from real projects."
            href="/templates"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {templates.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Portfolio */}
      {projects.length > 0 && (
        <section className="wrap pt-20">
          <SectionHeading eyebrow="Selected work" title="Recent projects" href="/portfolio" hrefLabel="All projects" />
          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="card group p-6 transition hover:border-ink">
                <h3 className="display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="wrap pt-24">
        <div className="rounded-3xl bg-ink px-8 py-14 text-center text-paper sm:px-16">
          <h2 className="display text-3xl font-semibold sm:text-4xl">Have a project in mind?</h2>
          <p className="mx-auto mt-3 max-w-lg text-paper/70">
            Tell me what you're building and I'll reply with next steps and a clear quote.
          </p>
          <Link href="/contact" className="btn-primary mt-7">Start a conversation</Link>
        </div>
      </section>
    </>
  );
}
