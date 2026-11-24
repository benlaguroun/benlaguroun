import type { Locale } from "../config";
import { ar } from "./ar";
import { en, type Dict } from "./en";
import { fr } from "./fr";

const dictionaries: Record<Locale, Dict> = { en, fr, ar };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

/** Fill {placeholders} in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

export type { Dict };
