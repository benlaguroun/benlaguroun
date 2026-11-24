import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, ErrorBanner, Pill } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { MoveButtons } from "@/components/admin/move-buttons";
import { TranslationFields } from "@/components/admin/translation-fields";
import { addModule, deleteModule, moveLesson, moveModule, updateModule } from "../../../catalog-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function CurriculumPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { id } = await params;
  const { error, saved } = await searchParams;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          modules: {
            orderBy: [{ position: "asc" }, { id: "asc" }],
            include: { lessons: { orderBy: [{ position: "asc" }, { id: "asc" }] } },
          },
        },
      },
    },
  });
  if (!product || product.type !== "COURSE" || !product.course) notFound();

  const base = `/${locale}/admin/products/${product.id}`;
  const modules = product.course.modules;
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <>
      <Link href={base} className="text-sm text-mute hover:text-ink">← {product.name}</Link>
      <div className="mt-4">
        <AdminHeading title="Curriculum">
          <Pill>{modules.length} module{modules.length === 1 ? "" : "s"}</Pill>
          <Pill>{totalLessons} lesson{totalLessons === 1 ? "" : "s"}</Pill>
        </AdminHeading>
      </div>
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        A course is made of modules, and each module holds lessons. Mark a few lessons as a free preview so visitors can try before they buy.
        If your course description says a number of lessons, make sure it matches the count here.
      </p>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      {modules.length === 0 && <Empty>No modules yet. Add the first one below.</Empty>}

      <div className="space-y-6">
        {modules.map((m, mi) => (
          <section key={m.id} className="glass p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-wider text-aqua">Module {mi + 1}</p>
              <div className="flex items-center gap-2">
                <MoveButtons action={moveModule} id={m.id} productId={product.id} locale={locale} first={mi === 0} last={mi === modules.length - 1} />
                <form action={deleteModule}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <ConfirmButton
                    message={`Delete the module “${m.title}” and its ${m.lessons.length} lesson(s)? Students' progress on them is lost too. This can't be undone.`}
                    className="btn btn-glass !px-3 !py-1.5 !text-xs !text-rose"
                  >
                    Delete module
                  </ConfirmButton>
                </form>
              </div>
            </div>

            <form action={updateModule} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="locale" value={locale} />
              <div className="flex gap-2">
                <input name="title" required defaultValue={m.title} aria-label="Module title" className="field flex-1" />
                <button type="submit" className="btn btn-glass !px-5">Save</button>
              </div>
              <TranslationFields translations={m.translations} fields={[{ key: "title", label: "Module title" }]} />
            </form>

            <ul className="mt-5 space-y-2">
              {m.lessons.map((l, li) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.03] px-4 py-3">
                  <div className="min-w-0">
                    <Link href={`${base}/lessons/${l.id}`} className="font-medium hover:text-aqua">{l.title}</Link>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-mute">
                      {l.durationMin ? `${l.durationMin} min` : "no duration"}
                      {l.videoUrl ? <Pill tone="info">video</Pill> : <Pill>text only</Pill>}
                      {l.isPreview && <Pill tone="good">free preview</Pill>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoveButtons action={moveLesson} id={l.id} productId={product.id} locale={locale} first={li === 0} last={li === m.lessons.length - 1} />
                    <Link href={`${base}/lessons/${l.id}`} className="btn btn-glass !px-4 !py-1.5 !text-sm">Edit</Link>
                  </div>
                </li>
              ))}
            </ul>
            <Link href={`${base}/lessons/new?module=${m.id}`} className="btn btn-glass mt-4 !px-4 !py-2 !text-sm">+ Add lesson</Link>
          </section>
        ))}
      </div>

      <form action={addModule} className="glass mt-8 flex flex-col gap-3 p-5 sm:flex-row">
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="locale" value={locale} />
        <input name="title" required placeholder="New module title, e.g. Find your niche" aria-label="New module title" className="field flex-1" />
        <button type="submit" className="btn btn-primary !px-5">Add module</button>
      </form>
    </>
  );
}
