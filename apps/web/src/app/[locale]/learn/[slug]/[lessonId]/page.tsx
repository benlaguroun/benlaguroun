import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { paragraphs } from "@/lib/format";
import { getSession } from "@/lib/session";
import { userOwns } from "@/lib/access";
import { CompleteLessonButton } from "@/components/complete-lesson-button";
import { ArrowBack, Lock } from "@/components/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lesson", robots: { index: false } };

type Props = { params: Promise<{ locale: string; slug: string; lessonId: string }> };

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params;
  const locale = await resolveLocale(params);
  const t = getDict(locale);

  const raw = await prisma.product.findUnique({
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
  if (!raw || raw.type !== "COURSE" || !raw.course) notFound();
  const product = localize(raw, locale);

  const modules = raw.course.modules.map((m) => ({
    ...localize(m, locale),
    lessons: m.lessons.map((l) => localize(l, locale)),
  }));
  const flat = modules.flatMap((m) => m.lessons);
  const index = flat.findIndex((l) => l.id === lessonId);
  const lesson = flat[index];
  if (!lesson) notFound();

  const session = await getSession();
  const owned = await userOwns(session?.user as { id: string; role?: string | null } | undefined, raw.id);

  // Paid lessons are members-only. Free previews are open to everyone.
  if (!owned && !lesson.isPreview) {
    redirect(
      session
        ? lp(locale, `/courses/${slug}`)
        : `${lp(locale, "/login")}?next=${encodeURIComponent(lp(locale, `/learn/${slug}/${lessonId}`))}`,
    );
  }

  const progress = session
    ? await prisma.lessonProgress.findMany({
        where: { userId: session.user.id, lessonId: { in: flat.map((l) => l.id) } },
        select: { lessonId: true },
      })
    : [];
  const doneSet = new Set(progress.map((p) => p.lessonId));
  const pct = Math.round((doneSet.size / Math.max(flat.length, 1)) * 100);

  const prev = flat[index - 1];
  const next = flat[index + 1];
  const canOpen = (l: { isPreview: boolean }) => owned || l.isPreview;

  return (
    <div className="wrap grid gap-10 py-10 lg:grid-cols-[320px_1fr]">
      {/* Curriculum sidebar */}
      <aside className="glass h-fit p-5 lg:sticky lg:top-24">
        <Link href={lp(locale, `/courses/${slug}`)} className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink">
          <ArrowBack /> {product.name}
        </Link>

        {owned && (
          <div className="mt-5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-mute">{t.learn.progress}</span>
              <span className="text-aqua">{pct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-iris to-aqua transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <nav className="mt-6 space-y-5" aria-label={t.learn.curriculum}>
          {modules.map((m, mi) => (
            <div key={m.id}>
              <p className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">
                {mi + 1}. {m.title}
              </p>
              <ul className="mt-2 space-y-1">
                {m.lessons.map((l) => {
                  const active = l.id === lesson.id;
                  const done = doneSet.has(l.id);
                  return (
                    <li key={l.id}>
                      {canOpen(l) ? (
                        <Link
                          href={lp(locale, `/learn/${slug}/${l.id}`)}
                          aria-current={active ? "page" : undefined}
                          className={`flex gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                            active ? "bg-iris/20 font-semibold text-ink" : "text-mute hover:bg-white/8 hover:text-ink"
                          }`}
                        >
                          <span aria-hidden className={done ? "text-aqua" : "text-white/25"}>{done ? "●" : "○"}</span>
                          <span>{l.title}</span>
                        </Link>
                      ) : (
                        <span className="flex gap-2.5 rounded-xl px-3 py-2 text-sm text-mute/60" title={t.learn.locked}>
                          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{l.title}</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Lesson body */}
      <article>
        {lesson.isPreview && !owned && (
          <p className="glass mb-5 px-5 py-3.5 text-sm">
            {t.learn.previewBanner}{" "}
            <Link href={lp(locale, `/courses/${slug}`)} className="font-semibold text-aqua hover:underline">
              {t.learn.getFull}
            </Link>
          </p>
        )}

        <p className="eyebrow">{t.learn.lesson} {index + 1}</p>
        <h1 className="display mt-3 text-3xl font-semibold sm:text-5xl">{lesson.title}</h1>
        {lesson.summary && <p className="mt-3 text-lg text-mute">{lesson.summary}</p>}

        {lesson.videoUrl && (
          <div className="glass mt-7 aspect-video overflow-hidden !rounded-2xl">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="mt-8 space-y-4 text-lg leading-relaxed">
          {paragraphs(lesson.content).map((para, i) => (
            <p key={i} className="whitespace-pre-line">{para}</p>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div>
            {owned && <CompleteLessonButton lessonId={lesson.id} courseSlug={slug} done={doneSet.has(lesson.id)} t={t.learn} />}
          </div>
          <div className="flex gap-2">
            {prev && canOpen(prev) && (
              <Link href={lp(locale, `/learn/${slug}/${prev.id}`)} className="btn btn-glass">
                <ArrowBack /> {t.learn.prev}
              </Link>
            )}
            {next && canOpen(next) && (
              <Link href={lp(locale, `/learn/${slug}/${next.id}`)} className="btn btn-glass">
                {t.learn.next} <ArrowBack className="rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
