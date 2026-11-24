"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { locales, localeMeta, isLocale, type Locale } from "@/i18n/config";
import { Globe } from "./icons";

/**
 * Just a globe icon. Click it to open a small menu with the three languages.
 * Choosing one swaps the first URL segment, remembers the choice in a cookie
 * (so the proxy sends you back to it) and reloads the page.
 */
export function LangSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`;
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

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
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        title={label}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/5 text-mute transition hover:bg-white/10 hover:text-ink"
      >
        <Globe className="h-[1.15rem] w-[1.15rem]" />
      </button>

      {open && (
        <ul role="menu" className="glass absolute end-0 top-full z-50 mt-2 w-40 p-1.5">
          {locales.map((l) => (
            <li key={l} role="none">
              <a
                role="menuitem"
                href={hrefFor(l)}
                hrefLang={l}
                lang={l}
                onClick={(e) => choose(e, l)}
                aria-current={l === current ? "true" : undefined}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                  l === current ? "bg-white/10 font-semibold text-ink" : "text-mute hover:bg-white/8 hover:text-ink"
                }`}
              >
                <span>{localeMeta[l].native}</span>
                <span className="font-mono text-[0.68rem] opacity-70">{localeMeta[l].short}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
