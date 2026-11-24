"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Close, Menu } from "./icons";
import { useIsActive, type NavItem } from "./nav-links";

/** Hamburger menu for phones and tablets. `children` is the account area. */
export function MobileNav({
  items,
  label,
  children,
}: {
  items: NavItem[];
  label: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = useIsActive();

  // Close after navigating, and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/5 text-ink transition hover:bg-white/10"
      >
        {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          {/* Tap outside to close */}
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[4.25rem] z-40 cursor-default bg-void/60 backdrop-blur-sm"
          />
          <div className="glass absolute inset-x-4 top-[4.75rem] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto p-3">
            <nav aria-label={label} className="grid gap-1">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 text-base font-medium transition ${
                      active ? "bg-white/10 text-ink" : "text-mute hover:bg-white/8 hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {children && <div className="mt-3 border-t border-line pt-3">{children}</div>}
          </div>
        </>
      )}
    </div>
  );
}
