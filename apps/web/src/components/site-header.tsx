import Link from "next/link";
import { site } from "@/config/site";
import { lp, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { AuthNav } from "./auth-nav";
import { LangSwitcher } from "./lang-switcher";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const items = site.nav.map((n) => ({ href: lp(locale, n.href), label: t.nav[n.key] }));
  const labels = { login: t.nav.login, signup: t.nav.signup, library: t.nav.library, signout: t.nav.signout };

  return (
    <header className="glass-bar sticky top-0 z-40">
      <div className="wrap relative flex h-[4.25rem] items-center justify-between gap-3">
        <Link href={lp(locale)} className="group flex shrink-0 items-center gap-2.5" aria-label={site.name}>
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-iris to-aqua font-mono text-sm font-bold text-void transition group-hover:rotate-6"
          >
            {site.name.charAt(0)}
          </span>
          <span className="display hidden text-lg font-semibold tracking-tight min-[400px]:block">{site.name}</span>
        </Link>

        <NavLinks items={items} label={t.nav.menu} />

        <div className="flex items-center gap-2">
          <LangSwitcher current={locale} label={t.nav.language} />
          {/* On phones the account buttons live inside the menu */}
          <div className="hidden lg:block">
            <AuthNav locale={locale} labels={labels} />
          </div>
          <MobileNav items={items} label={t.nav.menu}>
            <AuthNav locale={locale} labels={labels} stacked />
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
