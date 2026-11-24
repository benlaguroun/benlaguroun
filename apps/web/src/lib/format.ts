import type { ProductType } from "@brand/db";

export function formatPrice(cents: number | null | undefined, currency = "usd") {
  if (cents == null) return "Custom quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

const segment: Record<ProductType, string> = {
  SERVICE: "services",
  TEMPLATE: "templates",
  COURSE: "courses",
};

export function productHref(p: { type: ProductType; slug: string }) {
  return `/${segment[p.type]}/${p.slug}`;
}

/** Turn a plain text body into paragraphs. */
export function paragraphs(text: string) {
  return text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}
