import Link from "next/link";
import { activeSocial, site, navItems } from "@/config/site";
import { lp, type Locale } from "@/i18n/config";
import { SocialGlyph } from "./social-links";
import { NewsletterForm } from "./newsletter-form";
import { getDict } from "@/i18n/dictionaries";
import { sellerName } from "@/lib/company";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDict(locale);

  return (
    <footer className="mt-28 border-t border-line">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="display text-2xl font-semibold">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm text-mute">{t.footer.tagline}</p>
          <a href={`mailto:${site.email}`} className="mt-4 inline-block font-mono text-sm text-aqua hover:underline" dir="ltr">
            {site.email}
          </a>
        </div>

        <div>
          <p className="eyebrow">{t.footer.explore}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navItems().map((item) => (
              <li key={item.href}>
                <Link href={lp(locale, item.href)} className="text-mute transition hover:text-ink">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">{t.footer.elsewhere}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {activeSocial().map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 text-mute transition hover:text-ink">
                  <SocialGlyph k={s.key} className="h-4 w-4" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-line">
        <div className="wrap grid gap-5 py-10 md:grid-cols-[1.5fr_1fr_1fr] md:items-center">
          <div className="md:col-span-2">
            <p className="display text-xl font-semibold">{t.newsletter.title}</p>
            <p className="mt-2 max-w-xl text-sm text-mute">{t.newsletter.body}</p>
          </div>
          <NewsletterForm locale={locale} t={t.newsletter} />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-5 text-xs text-mute sm:flex-row">
          <p>
            © {new Date().getFullYear()} {sellerName}. {t.footer.rights}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link href={lp(locale, "/privacy")} className="transition hover:text-ink">{t.legal.privacy}</Link>
            <Link href={lp(locale, "/terms")} className="transition hover:text-ink">{t.legal.terms}</Link>
            <Link href={lp(locale, "/refunds")} className="transition hover:text-ink">{t.legal.refunds}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
