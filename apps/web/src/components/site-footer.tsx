import Link from "next/link";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-xl font-semibold">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm text-muted">{site.tagline}</p>
          <a href={`mailto:${site.email}`} className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            {site.email}
          </a>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-3 space-y-2 text-sm">
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
