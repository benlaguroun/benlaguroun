import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { defaultLocale, isLocale } from "@/i18n/config";
import { safeNext } from "@/lib/session";

// Small helpers shared by the admin server actions that edit content.

export function str(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}
export function optional(fd: FormData, key: string) {
  return str(fd, key) || null;
}
export function checked(fd: FormData, key: string) {
  return fd.get(key) === "on";
}
export function int(fd: FormData, key: string, fallback = 0) {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
}
export function localeOf(fd: FormData) {
  const l = str(fd, "locale");
  return isLocale(l) ? l : defaultLocale;
}
export function returnTo(fd: FormData, fallback: string) {
  return safeNext(str(fd, "returnTo"), fallback);
}

/** Send the admin back to a form with an error message shown above it. */
export function fail(path: string, message: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`);
}
export function refresh() {
  revalidatePath("/", "layout");
}

/** "Build Your Business!" -> "build-your-business". Letters and digits only. */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
export const isSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

/**
 * Clean a web address from a form. Returns null for an empty box, the cleaned
 * address when valid, or undefined when it isn't a usable http(s) link.
 * With allowRelative, a path on this site such as "/images/a.png" is accepted.
 */
export function cleanUrl(raw: string, allowRelative = false): string | null | undefined {
  if (!raw) return null;
  if (allowRelative && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** One item per line, blank lines dropped. */
export function lines(text: string, max = 20, maxLen = 160) {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, max);
}

type Translations = Record<string, Record<string, unknown>>;

/**
 * Build the translations JSON for French and Arabic from the form. Fields left
 * empty are removed so the site falls back to English. Keys this form doesn't
 * manage are kept as they were.
 */
export function buildTranslations(
  fd: FormData,
  existing: unknown,
  fields: { key: string; list?: boolean }[],
): Translations | null {
  const out: Translations = { ...((existing as Translations | null) ?? {}) };
  for (const loc of ["fr", "ar"] as const) {
    const next: Record<string, unknown> = { ...(out[loc] ?? {}) };
    for (const f of fields) {
      const raw = String(fd.get(`${loc}_${f.key}`) ?? "");
      const value = f.list ? lines(raw) : raw.trim();
      if (Array.isArray(value) ? value.length : value) next[f.key] = value;
      else delete next[f.key];
    }
    if (Object.keys(next).length) out[loc] = next;
    else delete out[loc];
  }
  return Object.keys(out).length ? out : null;
}
