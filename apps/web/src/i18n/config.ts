export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { native: string; short: string; dir: "ltr" | "rtl"; intl: string }> = {
  en: { native: "English", short: "EN", dir: "ltr", intl: "en-US" },
  fr: { native: "Français", short: "FR", dir: "ltr", intl: "fr-FR" },
  // "-u-nu-latn" keeps Western digits in Arabic, which is the norm in Morocco.
  ar: { native: "العربية", short: "AR", dir: "rtl", intl: "ar-u-nu-latn" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Prefix an internal path with a locale: lp("fr", "/courses") -> "/fr/courses". */
export function lp(locale: Locale, path = "/") {
  return `/${locale}${path === "/" ? "" : path}`;
}
