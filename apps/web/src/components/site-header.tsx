import Link from "next/link";
import { site } from "@/config/site";
import { lp, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { AuthNav } from "./auth-nav";
import { LangSwitcher } from "./lang-switcher";
import { MobileNav } from "./mobile-nav";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const items = site.nav.map((n) => ({ href: lp(locale, n.href), label: t.nav[n.key] }));

  return (
    <header className="glass-bar sticky top-0 z-40">
      <div className="wrap relative flex h-[4.25rem] items-center justify-between gap-4">
        <Link href={lp(locale)} className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-iris to-aqua font-mono text-sm font-bold text-void transition group-hover:rotate-6"
          >
            {site.name.charAt(0)}
          </span>
          <span className="display text-lg font-semibold tracking-tight">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-mute transition hover:bg-white/8 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher current={locale} label={t.nav.language} />
          <AuthNav
            locale={locale}
            labels={{ login: t.nav.login, signup: t.nav.signup, library: t.nav.library, signout: t.nav.signout }}
          />
          <MobileNav items={items} label={t.nav.menu} />
        </div>
      </div>
    </header>
  );
}
