import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, ErrorBanner, Pill } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { deleteTestimonial, setTestimonialPublished } from "../catalog-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminTestimonialsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error, saved } = await searchParams;

  const items = await prisma.testimonial.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <AdminHeading title="Testimonials" />
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Quotes from real clients. The section on the home page stays hidden until at least one is published, so there is nothing to
        fake: add yours as they come in.
      </p>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      <details className="glass mb-6 p-5" open={items.length === 0}>
        <summary className="cursor-pointer font-medium">+ Add a testimonial</summary>
        <div className="mt-5">
          <TestimonialForm locale={locale} />
        </div>
      </details>

      {items.length === 0 ? (
        <Empty>No testimonials yet.</Empty>
      ) : (
        <ul className="space-y-4">
          {items.map((t) => (
            <li key={t.id} className="glass p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{t.name}{t.role && <span className="font-normal text-mute"> · {t.role}</span>}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-mute" dir="auto">{t.quote}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={t.published ? "good" : "warn"}>{t.published ? "published" : "hidden"}</Pill>
                  <form action={setTestimonialPublished}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="published" value={t.published ? "0" : "1"} />
                    <button type="submit" className="btn btn-glass !px-3 !py-1.5 !text-xs">{t.published ? "Hide" : "Publish"}</button>
                  </form>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-aqua">Edit</summary>
                <div className="mt-4">
                  <TestimonialForm locale={locale} item={t} />
                  <form action={deleteTestimonial} className="mt-4 border-t border-line pt-4">
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <ConfirmButton message={`Delete the testimonial from ${t.name}?`}>Delete</ConfirmButton>
                  </form>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
