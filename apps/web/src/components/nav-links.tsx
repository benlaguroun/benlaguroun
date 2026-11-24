"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

/** True when the current page is this link or lives under it. */
export function useIsActive() {
  const pathname = usePathname() ?? "";
  return (href: string) => {
    // "/en" is the home page: only an exact match counts for it.
    const isHome = href.split("/").filter(Boolean).length <= 1;
    return isHome ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  };
}

/** Desktop links with a highlight on the page you are on. */
export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const isActive = useIsActive();
  return (
    <nav className="hidden items-center gap-0.5 lg:flex" aria-label={label}>
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-full px-3 py-2 text-sm font-medium transition ${
              active ? "bg-white/10 text-ink" : "text-mute hover:bg-white/8 hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
