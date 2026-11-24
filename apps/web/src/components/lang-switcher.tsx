"use client";

import { usePathname } from "next/navigation";
import { locales, localeMeta, isLocale, type Locale } from "@/i18n/config";
import { Globe } from "./icons";

/**
 * EN | FR | AR pill. Swaps the first URL segment, remembers the choice in a
 * cookie (so the proxy sends you back to it) and reloads the page.
 */
export function LangSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`;

  function hrefFor(next: Locale) {
    const parts = pathname.split("/");
    if (isLocale(parts[1])) parts[1] = next;
    else parts.splice(1, 0, next);
    return parts.join("/") || `/${next}`;
  }

  function choose(e: React.MouseEvent, next: Locale) {
    e.preventDefault();
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.assign(hrefFor(next) + window.location.search);
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-line bg-white/5 p-1"
      role="group"
      aria-label={label}
    >
      <Globe className="ms-2 h-4 w-4 text-mute" />
      {locales.map((l) => (
        <a
          key={l}
          href={hrefFor(l)}
          hrefLang={l}
          lang={l}
          onClick={(e) => choose(e, l)}
          aria-current={l === current ? "true" : undefined}
          title={localeMeta[l].native}
          className={`rounded-full px-2.5 py-1 font-mono text-[0.7rem] font-semibold tracking-wide transition ${
            l === current ? "bg-white text-void" : "text-mute hover:text-ink"
          }`}
        >
          {localeMeta[l].short}
        </a>
      ))}
    </div>
  );
}
