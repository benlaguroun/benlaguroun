import type { Locale } from "./config";

/**
 * Database rows keep their English text in the normal columns and other
 * languages in a `translations` JSON column shaped like:
 *   { fr: { name: "...", tagline: "..." }, ar: { name: "..." } }
 * localize() overlays the requested language on top of the English row, so
 * any field you haven't translated falls back to English.
 */
export function localize<T extends { translations?: unknown }>(item: T, locale: Locale): T {
  if (locale === "en") return item;
  const tr = item.translations as Record<string, Record<string, unknown>> | null | undefined;
  const overlay = tr?.[locale];
  return overlay ? { ...item, ...overlay } : item;
}
