import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";

/** Read and validate the [locale] route param. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
