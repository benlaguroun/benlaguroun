import Link from "next/link";
import { site } from "@/config/site";
import { lp, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

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
            {site.nav.map((item) => (
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
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-mute transition hover:text-ink">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-mute">
        © {new Date().getFullYear()} {site.name}. {t.footer.rights}
      </div>
    </footer>
  );
}
