import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { paragraphs } from "@/lib/format";
import { getSession } from "@/lib/session";
import { userOwns } from "@/lib/access";
import { ArrowBack } from "@/components/icons";
import { PurchasePanel } from "@/components/purchase-panel";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getCourse(slug: string) {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { position: "asc" },
            include: { lessons: { orderBy: { position: "asc" } } },
          },
        },
      },
    },
  });
  return p && p.type === "COURSE" && p.published && p.course ? { ...p, course: p.course } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const raw = await getCourse(slug);
  if (!raw) return {};
  const p = localize(raw, locale);
  return { title: p.name, description: p.tagline };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const raw = await getCourse(slug);
  if (!raw) notFound();
  const product = localize(raw, locale);

  const session = await getSession();
  const owned = await userOwns(session?.user as { id: string; role?: string | null } | undefined, product.id);

  const modules = product.course.modules.map((m) => {
    const lm = localize(m, locale);
    return { ...lm, lessons: m.lessons.map((l) => localize(l, locale)) };
  });
  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr]">
      <Reveal>
        <article>
          <Link href={lp(locale, "/courses")} className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink">
            <ArrowBack /> {t.product.allCourses}
          </Link>
          <p className="eyebrow mt-8">
            {t.product.types.COURSE} · {lessonCount} {t.product.lessons}
          </p>
          <h1 className="display mt-3 text-4xl font-semibold sm:text-6xl">
            <span className="text-gradient">{product.name}</span>
          </h1>
          <p className="mt-5 text-xl text-mute">{product.tagline}</p>
          <div className="mt-8 space-y-4 text-lg leading-relaxed">
            {paragraphs(product.description).map((para, i) => <p key={i}>{para}</p>)}
          </div>

          <h2 className="display mt-14 text-2xl font-semibold">{t.product.whatsInside}</h2>
          <div className="mt-6 space-y-4">
            {modules.map((m, mi) => (
              <section key={m.id} className="glass overflow-hidden">
                <h3 className="border-b border-line bg-white/5 px-5 py-3.5 font-mono text-xs uppercase tracking-wider text-aqua">
                  {t.product.module} {mi + 1} · {m.title}
                </h3>
                <ul className="divide-y divide-line">
                  {m.lessons.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                      <span>{l.title}</span>
                      <span className="flex shrink-0 items-center gap-3 text-mute">
                        {l.isPreview && (
                          <Link href={lp(locale, `/learn/${product.slug}/${l.id}`)} className="chip transition hover:bg-iris/25">
                            {t.product.freePreview}
                          </Link>
                        )}
                        {l.durationMin ? `${l.durationMin} ${t.product.min}` : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </Reveal>

      <Reveal delay={120}>
        <PurchasePanel product={product} locale={locale} signedIn={!!session} owned={owned} />
      </Reveal>
    </div>
  );
}
