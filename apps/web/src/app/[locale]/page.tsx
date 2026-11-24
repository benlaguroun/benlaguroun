import Link from "next/link";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { Arrow } from "@/components/icons";
import { NetworkDiagram } from "@/components/network-diagram";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TechMarquee } from "@/components/tech-marquee";
import { ProfilePhoto } from "@/components/profile-photo";
import { SocialIcons } from "@/components/social-links";
import { TypedRoles } from "@/components/typed-roles";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = getDict(locale);

  const [services, templates, courses, projects] = await Promise.all([
    prisma.product.findMany({ where: { type: "SERVICE", published: true }, orderBy: { position: "asc" }, take: 3 }),
    prisma.product.findMany({ where: { type: "TEMPLATE", published: true }, orderBy: { position: "asc" }, take: 3 }),
    prisma.product.findMany({ where: { type: "COURSE", published: true }, orderBy: { position: "asc" }, take: 3 }),
    prisma.project.findMany({ where: { featured: true }, orderBy: { position: "asc" }, take: 3 }),
  ]);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative">
        <div className="wrap grid gap-14 pb-16 pt-14 sm:pt-24 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <span className="glass inline-flex items-center gap-2.5 !rounded-full px-4 py-1.5 text-xs font-medium text-mute">
                <span className="live-dot" /> {t.hero.badge}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <p className="eyebrow mt-7">{t.hero.eyebrow}</p>
              <h1 className="display mt-4 text-[2.6rem] font-semibold leading-[1.08] sm:text-6xl lg:text-[4.2rem]">
                {t.hero.titleA} <span className="text-gradient">{t.hero.titleB}</span> {t.hero.titleC}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{t.hero.sub}</p>
              <div className="mt-5">
                <TypedRoles roles={t.hero.roles} />
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={lp(locale, "/services")} className="btn btn-primary">
                  {t.hero.ctaPrimary} <Arrow />
                </Link>
                <Link href={lp(locale, "/courses")} className="btn btn-glass">
                  {t.hero.ctaSecondary}
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm text-mute">{t.hero.follow}</span>
                <SocialIcons />
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-sm">
              <span className="deco -inset-8 rounded-full bg-gradient-to-br from-iris/30 via-transparent to-aqua/25 blur-3xl" />

              <div className="photo-ring">
                <div className="inner aspect-[4/5]">
                  <ProfilePhoto alt={fill(t.hero.photoAlt, { name: site.name })} priority />
                </div>
              </div>

              {/* Floating skill chips */}
              <span className="glass node-float absolute -start-4 top-10 !rounded-full px-4 py-2 font-mono text-xs sm:-start-10">
                {t.hero.chips[0]}
              </span>
              <span
                className="glass node-float absolute -end-3 top-1/2 !rounded-full px-4 py-2 font-mono text-xs sm:-end-9"
                style={{ animationDelay: "-2.4s" }}
              >
                {t.hero.chips[1]}
              </span>
              <span
                className="glass node-float absolute -start-2 bottom-24 !rounded-full px-4 py-2 font-mono text-xs sm:-start-8"
                style={{ animationDelay: "-4.8s" }}
              >
                <span className="live-dot me-2 inline-block align-middle" />
                {t.hero.chips[2]}
              </span>

              {/* Name card */}
              <div className="glass absolute inset-x-5 -bottom-5 flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="display truncate text-base font-semibold">{site.name}</p>
                  <p className="truncate font-mono text-[0.68rem] text-aqua">{t.hero.roles[1]}</p>
                </div>
                <Link href={lp(locale, "/about")} className="btn btn-glass !px-3.5 !py-2 text-xs">
                  {t.nav.about} <Arrow />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="wrap pb-4">
          <TechMarquee items={site.stack} />
        </div>
      </section>

      {/* ───────────── Pillars ───────────── */}
      <section className="wrap pt-24">
        <SectionHeading eyebrow={t.pillars.eyebrow} title={t.pillars.title} />
        <div className="grid gap-5 md:grid-cols-3">
          {t.pillars.items.map((item, i) => (
            <Reveal key={item.t} delay={i * 100}>
              <div className="glass spot h-full p-7">
                <span className="deco -start-8 -top-8 h-28 w-28 rounded-full bg-iris/25 blur-3xl" />
                <p className="font-mono text-xs text-aqua">0{i + 1}</p>
                <h3 className="display mt-4 text-2xl font-semibold">{item.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{item.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Services ───────────── */}
      {services.length > 0 && (
        <section className="wrap pt-28">
          <SectionHeading
            {...t.sections.services}
            href={lp(locale, "/services")}
            hrefLabel={t.sections.seeAll}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Local-first lab ───────────── */}
      <section className="wrap pt-28">
        <Reveal>
          <div className="glass relative overflow-hidden p-8 sm:p-12">
            <span className="deco -bottom-24 -start-24 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
              <div>
                <p className="eyebrow">{t.lab.eyebrow}</p>
                <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">{t.lab.title}</h2>
                <p className="mt-4 leading-relaxed text-mute">{t.lab.body}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {t.lab.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-iris to-aqua" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <NetworkDiagram labels={t.lab.nodes} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── Courses ───────────── */}
      {courses.length > 0 && (
        <section className="wrap pt-28">
          <SectionHeading
            {...t.sections.courses}
            href={lp(locale, "/courses")}
            hrefLabel={t.sections.seeAll}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {courses.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Templates ───────────── */}
      {templates.length > 0 && (
        <section className="wrap pt-28">
          <SectionHeading
            {...t.sections.templates}
            href={lp(locale, "/templates")}
            hrefLabel={t.sections.seeAll}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {templates.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Work ───────────── */}
      {projects.length > 0 && (
        <section className="wrap pt-28">
          <SectionHeading
            {...t.sections.work}
            href={lp(locale, "/portfolio")}
            hrefLabel={t.sections.allProjects}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((raw, i) => {
              const p = localize(raw, locale);
              return (
                <Reveal key={p.id} delay={i * 100}>
                  <Link href={lp(locale, `/portfolio/${p.slug}`)} className="glass spot block h-full p-7">
                    <span className="deco -end-8 -top-8 h-28 w-28 rounded-full bg-rose/20 blur-3xl" />
                    <h3 className="display text-xl font-semibold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{p.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5" dir="ltr">
                      {p.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ───────────── Final call to action ───────────── */}
      <section className="wrap pt-28">
        <Reveal>
          <div className="glass relative overflow-hidden px-8 py-16 text-center sm:px-16">
            <span className="deco start-1/2 top-0 h-64 w-[28rem] -translate-x-1/2 rounded-full bg-iris/30 blur-3xl rtl:translate-x-1/2" />
            <div className="relative">
              <h2 className="display text-3xl font-semibold sm:text-5xl">
                <span className="text-gradient">{t.cta.title}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-mute">{t.cta.body}</p>
              <Link href={lp(locale, "/contact")} className="btn btn-primary mt-8">
                {t.cta.button} <Arrow />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
