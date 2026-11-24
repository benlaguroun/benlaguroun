import type { Testimonial } from "@brand/db";
import { saveTestimonial } from "@/app/[locale]/admin/catalog-actions";
import { TranslationFields } from "./translation-fields";

export function TestimonialForm({ locale, item }: { locale: string; item?: Testimonial }) {
  const k = item?.id ?? "new";
  return (
    <form action={saveTestimonial} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {item && <input type="hidden" name="id" value={item.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`name-${k}`} className="label">Who said it *</label>
          <input id={`name-${k}`} name="name" required defaultValue={item?.name} className="field" />
        </div>
        <div>
          <label htmlFor={`role-${k}`} className="label">Role and company</label>
          <input id={`role-${k}`} name="role" defaultValue={item?.role ?? ""} placeholder="Director, Al Noor School" className="field" />
        </div>
      </div>

      <div>
        <label htmlFor={`quote-${k}`} className="label">What they said *</label>
        <textarea id={`quote-${k}`} name="quote" required rows={4} maxLength={1000} defaultValue={item?.quote} className="field" />
        <p className="mt-1 text-xs text-mute">Only publish words a client really gave you, and ask their permission first.</p>
      </div>

      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="published" defaultChecked={item?.published ?? false} className="h-4 w-4 accent-[var(--color-aqua)]" />
          Show on the home page
        </label>
        <div className="w-28">
          <label htmlFor={`position-${k}`} className="label">Order</label>
          <input id={`position-${k}`} name="position" type="number" dir="ltr" defaultValue={item?.position ?? 0} className="field" />
        </div>
      </div>

      <TranslationFields
        translations={item?.translations}
        fields={[
          { key: "role", label: "Role and company" },
          { key: "quote", label: "Quote", rows: 4 },
        ]}
      />

      <button type="submit" className="btn btn-primary">{item ? "Save changes" : "Add testimonial"}</button>
    </form>
  );
}
