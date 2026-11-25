import type { Product, ProductType } from "@brand/db";
import { saveProduct } from "@/app/[locale]/admin/catalog-actions";
import { DeliveryField } from "./delivery-field";
import { ImageField } from "./image-fields";
import { TranslationFields } from "./translation-fields";

const typeLabel: Record<ProductType, string> = { SERVICE: "Service", TEMPLATE: "Template", COURSE: "Course" };

const priceText = (cents: number | null) =>
  cents == null ? "" : cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);

export function ProductForm({
  locale,
  product,
  newType,
}: {
  locale: string;
  product?: Product;
  newType?: ProductType;
}) {
  const type = product?.type ?? newType;

  return (
    <form action={saveProduct} className="glass space-y-6 p-6">
      <input type="hidden" name="locale" value={locale} />
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="type" value={type ?? ""} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Name *</label>
          <input id="name" name="name" required defaultValue={product?.name} className="field" />
        </div>
        <div>
          <label htmlFor="slug" className="label">Web address (slug)</label>
          <input
            id="slug"
            name="slug"
            dir="ltr"
            defaultValue={product?.slug}
            placeholder="made from the name if left empty"
            className="field"
          />
          <p className="mt-1 text-xs text-mute">Part of the page link. Changing it breaks links people already have.</p>
        </div>
      </div>

      <div>
        <label htmlFor="tagline" className="label">Tagline * <span className="text-mute">(one line, shown on cards)</span></label>
        <input id="tagline" name="tagline" required defaultValue={product?.tagline} className="field" />
      </div>

      <div>
        <label htmlFor="description" className="label">Description * <span className="text-mute">(blank line = new paragraph)</span></label>
        <textarea id="description" name="description" required rows={7} defaultValue={product?.description} className="field" />
      </div>

      <div>
        <label htmlFor="features" className="label">Bullet points <span className="text-mute">(one per line, up to 12)</span></label>
        <textarea id="features" name="features" rows={5} defaultValue={product?.features.join("\n")} className="field" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className="label">
            Price {type === "SERVICE" ? <span className="text-mute">(empty = custom quote)</span> : "*"}
          </label>
          <input
            id="price"
            name="price"
            inputMode="decimal"
            dir="ltr"
            defaultValue={priceText(product?.priceCents ?? null)}
            placeholder="149"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="currency" className="label">Currency</label>
          <input id="currency" name="currency" dir="ltr" maxLength={3} defaultValue={product?.currency ?? "usd"} className="field" />
          <p className="mt-1 text-xs text-mute">PayPal needs usd or eur.</p>
        </div>
        <div>
          <label htmlFor="position" className="label">Order on the page</label>
          <input
            id="position"
            name="position"
            type="number"
            dir="ltr"
            defaultValue={product?.position}
            placeholder="last"
            className="field"
          />
          <p className="mt-1 text-xs text-mute">Lower numbers come first.</p>
        </div>
      </div>

      <ImageField name="imageUrl" label="Cover image (optional)" defaultValue={product?.imageUrl} />

      {type === "TEMPLATE" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-5">
            <DeliveryField file={product?.deliveryFile} name={product?.deliveryName} />
            <div>
              <label htmlFor="deliveryUrl" className="label">Or a download link</label>
              <input
                id="deliveryUrl"
                name="deliveryUrl"
                dir="ltr"
                defaultValue={product?.deliveryUrl ?? ""}
                placeholder="https://drive.google.com/… (only used if no file is uploaded)"
                className="field"
              />
              <p className="mt-1 text-xs text-mute">
                A link can't expire or be taken back once a buyer has seen it, so an uploaded file is safer.
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="previewUrl" className="label">Live preview link</label>
            <input id="previewUrl" name="previewUrl" dir="ltr" defaultValue={product?.previewUrl ?? ""} className="field" />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="published" defaultChecked={product?.published ?? false} className="h-4 w-4 accent-[var(--color-aqua)]" />
          Published (visible on the site)
        </label>
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-4 w-4 accent-[var(--color-aqua)]" />
          Featured
        </label>
      </div>

      <TranslationFields
        translations={product?.translations}
        fields={[
          { key: "name", label: "Name" },
          { key: "tagline", label: "Tagline" },
          { key: "description", label: "Description", rows: 6 },
          { key: "features", label: "Bullet points", rows: 4, list: true },
        ]}
      />

      <button type="submit" className="btn btn-primary">
        {product ? "Save changes" : `Create ${type ? typeLabel[type]?.toLowerCase() : "product"}`}
      </button>
    </form>
  );
}
