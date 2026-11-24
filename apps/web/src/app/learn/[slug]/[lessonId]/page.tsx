import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { paragraphs } from "@/lib/format";
import { getSession } from "@/lib/session";
import { userOwns } from "@/lib/access";
import { CompleteLessonButton } from "@/components/complete-lesson-button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lesson", robots: { index: false } };

type Props = { params: Promise<{ slug: string; lessonId: string }> };

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params;

  const product = await prisma.product.findUnique({
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
  if (!product || product.type !== "COURSE" || !product.course) notFound();

  const modules = product.course.modules;
  const flat = modules.flatMap((m) => m.lessons);
  const index = flat.findIndex((l) => l.id === lessonId);
  const lesson = flat[index];
  if (!lesson) notFound();

  const session = await getSession();
  const owned = await userOwns(session?.user as { id: string; role?: string | null } | undefined, product.id);

  // Paid lessons are members-only. Free previews are open to everyone.
  if (!owned && !lesson.isPreview) {
    redirect(session ? `/courses/${slug}` : `/login?next=${encodeURIComponent(`/learn/${slug}/${lessonId}`)}`);
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
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Link href={`/courses/${slug}`} className="text-sm text-muted hover:text-ink">← {product.name}</Link>
        {owned && (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <nav className="mt-6 space-y-5" aria-label="Course curriculum">
          {modules.map((m, mi) => (
            <div key={m.id}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {mi + 1}. {m.title}
              </p>
              <ul className="mt-2 space-y-1">
                {m.lessons.map((l) => {
                  const active = l.id === lesson.id;
                  const content = (
                    <>
                      <span aria-hidden className={doneSet.has(l.id) ? "text-accent" : "text-line"}>
                        {doneSet.has(l.id) ? "●" : "○"}
                      </span>
                      <span>{l.title}</span>
                    </>
                  );
                  return (
                    <li key={l.id}>
                      {canOpen(l) ? (
                        <Link
                          href={`/learn/${slug}/${l.id}`}
                          aria-current={active ? "page" : undefined}
                          className={`flex gap-2 rounded-lg px-3 py-2 text-sm ${
                            active ? "bg-accent-soft font-semibold" : "hover:bg-card"
                          }`}
                        >
                          {content}
                        </Link>
                      ) : (
                        <span className="flex gap-2 rounded-lg px-3 py-2 text-sm text-muted/70">
                          <span aria-hidden>🔒</span>
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
          <p className="mb-4 rounded-xl bg-accent-soft px-4 py-3 text-sm">
            You're watching a free preview.{" "}
            <Link href={`/courses/${slug}`} className="font-semibold text-accent hover:underline">
              Get the full course
            </Link>
          </p>
        )}

        <h1 className="display text-3xl font-semibold sm:text-4xl">{lesson.title}</h1>
        {lesson.summary && <p className="mt-2 text-lg text-muted">{lesson.summary}</p>}

        {lesson.videoUrl && (
          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-line bg-black">
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

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div>
            {owned && <CompleteLessonButton lessonId={lesson.id} courseSlug={slug} done={doneSet.has(lesson.id)} />}
          </div>
          <div className="flex gap-2">
            {prev && canOpen(prev) && (
              <Link href={`/learn/${slug}/${prev.id}`} className="btn-ghost">← Previous</Link>
            )}
            {next && canOpen(next) && (
              <Link href={`/learn/${slug}/${next.id}`} className="btn-ghost">Next →</Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
