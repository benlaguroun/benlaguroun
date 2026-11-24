"use client";

import Link from "next/link";
import { useState } from "react";
import { Close, Menu } from "./icons";

type Item = { href: string; label: string };

export function MobileNav({ items, label }: { items: Item[]; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/5 text-ink"
      >
        {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <nav className="glass absolute inset-x-4 top-[4.5rem] z-50 p-3" aria-label={label}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-base font-medium text-ink transition hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
