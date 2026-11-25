import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { localeMeta, lp, type Locale } from "@/i18n/config";
import { fill, getDict } from "@/i18n/dictionaries";
import { companyLabels, identity, legalDocs, type LegalKey } from "@/i18n/legal";
import { governingLaw, hasCompany, jurisdiction, sellerName } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "./reveal";

const values = (locale: Locale) => {
  const base = {
    brand: site.name,
    seller: sellerName,
    email: site.email,
    jurisdiction,
    governing: governingLaw,
    days: site.legal.refundDays,
    entityType: site.company.entityType,
  };
  return { ...base, sellerLine: fill(hasCompany ? identity[locale].company : identity[locale].person, base) };
};

export function legalMetadata(locale: Locale, key: LegalKey): Metadata {
  const doc = legalDocs[locale][key];
  return pageMetadata({ locale, path: `/${key}`, title: doc.title, description: doc.description });
}

/** One legal page (privacy, terms or refunds), with links to the other two. */
export function LegalDocument({ locale, docKey }: { locale: Locale; docKey: LegalKey }) {
  const t = getDict(locale);
  const doc = legalDocs[locale][docKey];
  const v = values(locale);
  const labels = companyLabels[locale];
  const date = new Intl.DateTimeFormat(localeMeta[locale].intl, { dateStyle: "long" }).format(new Date(site.legal.updated));
  const others = (["privacy", "terms", "refunds"] as const).filter((k) => k !== docKey);

  return (
    <article className="wrap max-w-3xl py-16 sm:py-24">
      <Reveal>
        <h1 className="display text-4xl font-semibold sm:text-5xl">
          <span className="text-gradient">{doc.title}</span>
        </h1>
        <p className="mt-3 font-mono text-xs text-mute">{fill(t.legal.updated, { date })}</p>
        <p className="mt-6 text-lg leading-relaxed text-mute">{fill(doc.intro, v)}</p>
      </Reveal>

      <div className="mt-12 space-y-10">
        {doc.sections.map((s, i) => (
          <section key={s.h}>
            <h2 className="display text-xl font-semibold">
              <span className="me-2 font-mono text-sm text-aqua">{String(i + 1).padStart(2, "0")}</span>
              {s.h}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-mute">
              {s.p.map((para) => (
                <p key={para}>{fill(para, v)}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {hasCompany && (
        <section aria-labelledby="company-details" className="glass mt-12 p-6">
          <h2 id="company-details" className="display text-lg font-semibold">{labels.heading}</h2>
          <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
            {(
              [
                [labels.legalName, site.company.legalName],
                [labels.type, site.company.entityType],
                [labels.registeredIn, site.company.jurisdiction],
                [labels.number, site.company.registrationNumber],
                [labels.vat, site.company.taxNumber],
                [labels.address, site.company.address],
                [labels.contact, site.email],
              ] as const
            )
              .filter(([, value]) => value.trim())
              .map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-mute">{label}</dt>
                  <dd className="font-medium" dir="ltr" style={{ unicodeBidi: "plaintext" }}>{value}</dd>
                </div>
              ))}
          </dl>
        </section>
      )}

      <div className="mt-14 border-t border-line pt-6 text-sm text-mute">
        <p>{fill(t.legal.questions, { email: site.email })}</p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {others.map((k) => (
            <Link key={k} href={lp(locale, `/${k}`)} className="text-aqua hover:underline">
              {legalDocs[locale][k].title}
            </Link>
          ))}
        </p>
      </div>
    </article>
  );
}
