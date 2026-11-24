import Link from "next/link";
import { site } from "@/config/site";
import { AuthNav } from "./auth-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="display text-xl font-semibold">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <AuthNav />
      </div>

      {/* Compact nav for small screens */}
      <nav className="wrap flex gap-5 overflow-x-auto pb-3 md:hidden" aria-label="Main (mobile)">
        {site.nav.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap text-sm font-medium text-muted hover:text-ink">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
