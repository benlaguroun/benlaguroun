"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Close, Menu } from "./icons";
import { useIsActive, type NavItem } from "./nav-links";

/**
 * Hamburger menu for phones and tablets (everything below the desktop layout).
 * `children` is the account area. On phones the menu fills the width under the
 * header; on tablets it is a card on the right (left in Arabic).
 */
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
    // Keep the page from scrolling behind the open menu.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // If the window grows to the desktop layout, close the menu.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = previous;
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={label}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white/5 text-ink transition hover:bg-white/10"
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
            className="fixed inset-x-0 bottom-0 top-[4.25rem] z-40 cursor-default bg-void/60 backdrop-blur-sm"
          />
          {/* Positioned by this wrapper: .glass sets its own `position`, which would override `fixed`. */}
          <div id="mobile-menu" className="fixed inset-x-3 top-[4.75rem] z-50 sm:inset-x-auto sm:end-6 sm:w-80">
          <div className="glass max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain p-3">
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
          </div>
        </>
      )}
    </div>
  );
}
