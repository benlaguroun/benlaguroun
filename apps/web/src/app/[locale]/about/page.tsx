import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { lp } from "@/i18n/config";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { pageMetadata } from "@/lib/seo";
import { Arrow } from "@/components/icons";
import { NetworkDiagram } from "@/components/network-diagram";
import { JsonLd } from "@/components/json-ld";
import { ProfilePhoto } from "@/components/profile-photo";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SocialCards, SocialIcons } from "@/components/social-links";
import { Terminal } from "@/components/terminal";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const a = getDict(locale).about;
  return pageMetadata({ locale, path: "/about", title: a.eyebrow, description: a.intro[0] });
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const a = t.about;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: a.faq.items.map((q) => ({
            "@type": "Question",
            name: q.t,
            acceptedAnswer: { "@type": "Answer", text: q.d },
          })),
        }}
      />
      {/* ───────────── Intro with portrait ───────────── */}
      <section className="border-b border-line">
        <div className="wrap grid gap-14 py-16 sm:py-24 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[20rem]">
              <span className="deco -inset-6 rounded-full bg-gradient-to-br from-iris/30 to-aqua/20 blur-3xl" />
              <div className="photo-ring">
                <div className="inner aspect-[4/5]">
                  <ProfilePhoto variant="about" alt={fill(t.hero.photoAlt, { name: site.name })} priority />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow">{a.eyebrow}</p>
            <h1 className="display mt-4 text-4xl font-semibold sm:text-6xl">
              <span className="text-gradient">{a.title}</span>
            </h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-mute">
              {a.intro.map((para) => <p key={para}>{para}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href={lp(locale, "/contact")} className="btn btn-primary">
                {a.cta.button} <Arrow />
              </Link>
              <SocialIcons />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── What I do ───────────── */}
      <section className="wrap pt-24">
        <SectionHeading eyebrow={a.what.eyebrow} title={a.what.title} />
        <div className="grid gap-5 md:grid-cols-3">
          {a.what.items.map((item, i) => (
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

      {/* ───────────── What I build ───────────── */}
      <section className="wrap pt-24">
        <SectionHeading eyebrow={a.build.eyebrow} title={a.build.title} />
        <div className="grid gap-4 md:grid-cols-2">
          {a.build.items.map((item, i) => (
            <Reveal key={item.t} delay={(i % 2) * 90}>
              <div className="glass spot flex h-full gap-5 p-6">
                <span
                  aria-hidden
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-iris to-aqua"
                />
                <div>
                  <h3 className="display text-xl font-semibold">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{item.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Why work with me ───────────── */}
      <section className="wrap pt-24">
        <SectionHeading eyebrow={a.why.eyebrow} title={a.why.title} body={a.why.body} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {a.why.items.map((item, i) => (
            <Reveal key={item.t} delay={(i % 3) * 90}>
              <div className="glass spot h-full p-7">
                <span className="deco -end-8 -top-8 h-28 w-28 rounded-full bg-aqua/15 blur-3xl" />
                <p className="font-mono text-xs text-aqua">0{i + 1}</p>
                <h3 className="display mt-4 text-xl font-semibold leading-snug">{item.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{item.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── How we work ───────────── */}
      <section className="wrap pt-24">
        <SectionHeading eyebrow={a.process.eyebrow} title={a.process.title} />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {a.process.items.map((step, i) => (
            <li key={step.t}>
              <Reveal delay={i * 90}>
                <div className="glass h-full p-6">
                  <span className="display text-gradient text-4xl font-semibold">{i + 1}</span>
                  <h3 className="display mt-3 text-lg font-semibold">{step.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{step.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── Toolkit ───────────── */}
      <section className="wrap pt-24">
        <SectionHeading eyebrow={a.toolkit.eyebrow} title={a.toolkit.title} />
        <Reveal>
          <ul className="flex flex-wrap gap-3" dir="ltr">
            {site.stack.map((item) => (
              <li
                key={item}
                className="glass flex items-center gap-2.5 !rounded-full px-5 py-2.5 font-mono text-sm text-mute transition hover:-translate-y-0.5 hover:text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-iris to-aqua" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ───────────── Setup: terminal + network ───────────── */}
      <section className="wrap pt-24">
        <SectionHeading eyebrow={a.setup.eyebrow} title={a.setup.title} body={a.setup.body} />
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Terminal />
          </Reveal>
          <Reveal delay={120}>
            <div className="glass p-6">
              <NetworkDiagram labels={t.lab.nodes} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="wrap max-w-3xl pt-24">
        <SectionHeading eyebrow={a.faq.eyebrow} title={a.faq.title} />
        <div className="space-y-3">
          {a.faq.items.map((q) => (
            <Reveal key={q.t}>
              <details className="glass group p-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 font-medium">
                  {q.t}
                  <span aria-hidden className="text-aqua transition group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-mute">{q.d}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Social proof ───────────── */}
      <section className="wrap pt-24">
        <SectionHeading eyebrow={a.social.eyebrow} title={a.social.title} body={a.social.body} />
        <Reveal>
          <SocialCards
            descriptions={{
              github: a.social.github,
              linkedin: a.social.linkedin,
              facebook: a.social.facebook,
            }}
          />
        </Reveal>
      </section>

      {/* ───────────── Call to action ───────────── */}
      <section className="wrap pt-24">
        <Reveal>
          <div className="glass relative overflow-hidden px-8 py-14 text-center sm:px-16">
            <span className="deco start-1/2 top-0 h-56 w-[26rem] -translate-x-1/2 rounded-full bg-iris/30 blur-3xl rtl:translate-x-1/2" />
            <div className="relative">
              <h2 className="display text-3xl font-semibold sm:text-4xl">
                <span className="text-gradient">{a.cta.title}</span>
              </h2>
              <Link href={lp(locale, "/contact")} className="btn btn-primary mt-7">
                {a.cta.button} <Arrow />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
