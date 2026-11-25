"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Badge = "messages" | "errors" | "assistant";

const items: { href: string; label: string; exact?: boolean; badge?: Badge }[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/roadmap", label: "Roadmap" },
  { href: "/admin/assistant", label: "Ben (AI)", badge: "assistant" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/messages", label: "Messages", badge: "messages" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/errors", label: "Errors", badge: "errors" },
];

export function AdminNav({
  locale,
  newMessages,
  openErrors,
  assistantWaiting,
}: {
  locale: string;
  newMessages: number;
  openErrors: number;
  assistantWaiting: number;
}) {
  const pathname = usePathname() ?? "";
  const counts: Record<Badge, number> = { messages: newMessages, errors: openErrors, assistant: assistantWaiting };

  return (
    <nav aria-label="Admin" className="glass flex gap-1 overflow-x-auto p-2 lg:flex-col">
      {items.map((item) => {
        const href = `/${locale}${item.href}`;
        const active = item.exact ? pathname === href : pathname.startsWith(href);
        const count = item.badge ? counts[item.badge] : 0;
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
            {count > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[0.65rem] font-bold text-void ${item.badge === "errors" ? "bg-rose" : "bg-aqua"}`}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
