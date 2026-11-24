import type { ProductType } from "@brand/db";
import { localeMeta, type Locale } from "@/i18n/config";

export function formatPrice(
  cents: number | null | undefined,
  currency: string,
  locale: Locale,
  customLabel: string,
) {
  if (cents == null) return customLabel;
  return new Intl.NumberFormat(localeMeta[locale].intl, {
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

/** Path without the locale prefix. Wrap with lp(locale, ...) for links. */
export function productPath(p: { type: ProductType; slug: string }) {
  return `/${segment[p.type]}/${p.slug}`;
}

/** Turn a plain text body into paragraphs. */
export function paragraphs(text: string) {
  return text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}
