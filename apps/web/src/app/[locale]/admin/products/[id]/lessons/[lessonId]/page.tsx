import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { TranslationFields } from "@/components/admin/translation-fields";
import { deleteLesson, saveLesson } from "../../../../catalog-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string; lessonId: string }>;
  searchParams: Promise<{ module?: string; error?: string; saved?: string }>;
};

export default async function LessonEditorPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { id, lessonId } = await params;
  const { module: moduleParam, error, saved } = await searchParams;

  const product = await prisma.product.findUnique({ where: { id }, select: { id: true, name: true, type: true } });
  if (!product || product.type !== "COURSE") notFound();

  const lesson =
    lessonId === "new"
      ? null
      : await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: { select: { id: true, title: true, course: { select: { productId: true } } } } } });
  if (lessonId !== "new" && (!lesson || lesson.module.course.productId !== product.id)) notFound();

  const mod = lesson
    ? lesson.module
    : moduleParam
      ? await prisma.module.findFirst({ where: { id: moduleParam, course: { productId: product.id } }, select: { id: true, title: true } })
      : null;
  if (!mod) notFound();

  const curriculum = `/${locale}/admin/products/${product.id}/curriculum`;

  return (
    <>
      <Link href={curriculum} className="text-sm text-mute hover:text-ink">← Curriculum</Link>
      <div className="mt-4">
        <AdminHeading title={lesson ? "Edit lesson" : "New lesson"} />
      </div>
      <p className="-mt-2 mb-6 text-sm text-mute">In module “{mod.title}” of {product.name}.</p>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      <form action={saveLesson} className="glass space-y-6 p-6">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="moduleId" value={mod.id} />
        {lesson && <input type="hidden" name="id" value={lesson.id} />}

        <div>
          <label htmlFor="title" className="label">Title *</label>
          <input id="title" name="title" required defaultValue={lesson?.title} className="field" />
        </div>

        <div>
          <label htmlFor="summary" className="label">Short summary <span className="text-mute">(one line under the title)</span></label>
          <input id="summary" name="summary" defaultValue={lesson?.summary ?? ""} className="field" />
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
          <div>
            <label htmlFor="videoUrl" className="label">Video link <span className="text-mute">(optional)</span></label>
            <input
              id="videoUrl"
              name="videoUrl"
              dir="ltr"
              defaultValue={lesson?.videoUrl ?? ""}
              placeholder="Paste a YouTube or Vimeo link"
              className="field"
            />
            <p className="mt-1 text-xs text-mute">It is turned into an embed automatically. Unlisted YouTube videos work well for paid lessons.</p>
          </div>
          <div>
            <label htmlFor="durationMin" className="label">Minutes</label>
            <input id="durationMin" name="durationMin" type="number" min={1} max={600} dir="ltr" defaultValue={lesson?.durationMin ?? ""} className="field" />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="label">Lesson text <span className="text-mute">(blank line = new paragraph)</span></label>
          <textarea id="content" name="content" rows={14} defaultValue={lesson?.content} className="field" />
        </div>

        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="isPreview" defaultChecked={lesson?.isPreview ?? false} className="h-4 w-4 accent-[var(--color-aqua)]" />
          Free preview (anyone can watch this lesson without buying)
        </label>

        <TranslationFields
          translations={lesson?.translations}
          fields={[
            { key: "title", label: "Title" },
            { key: "summary", label: "Short summary" },
            { key: "content", label: "Lesson text", rows: 10 },
          ]}
        />

        <button type="submit" className="btn btn-primary">{lesson ? "Save lesson" : "Add lesson"}</button>
      </form>

      {lesson && (
        <form action={deleteLesson} className="mt-8 border-t border-line pt-6">
          <input type="hidden" name="id" value={lesson.id} />
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="locale" value={locale} />
          <ConfirmButton message={`Delete the lesson “${lesson.title}”? This can't be undone.`}>Delete lesson</ConfirmButton>
        </form>
      )}
    </>
  );
}
