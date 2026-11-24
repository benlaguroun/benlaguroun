"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/messages", label: "Messages", badge: true },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/payments", label: "Payments" },
];

export function AdminNav({ locale, newMessages }: { locale: string; newMessages: number }) {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Admin" className="glass flex gap-1 overflow-x-auto p-2 lg:flex-col">
      {items.map((item) => {
        const href = `/${locale}${item.href}`;
        const active = item.exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={item.href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active ? "bg-iris/25 text-ink" : "text-mute hover:bg-white/8 hover:text-ink"
            }`}
          >
            {item.label}
            {item.badge && newMessages > 0 && (
              <span className="rounded-full bg-aqua px-2 py-0.5 font-mono text-[0.65rem] font-bold text-void">{newMessages}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
