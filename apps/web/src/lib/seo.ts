import type { Metadata } from "next";
import { site, activeSocial } from "@/config/site";
import { locales, type Locale } from "@/i18n/config";
import { getProfilePhoto } from "@/lib/profile";
import { siteUrl } from "@/lib/site-url";

const ogLocale: Record<Locale, string> = { en: "en_US", fr: "fr_FR", ar: "ar_AR" };

/** "/services" + "fr" -> "/fr/services". The home page is path "". */
export const pathFor = (locale: Locale, path = "") => `/${locale}${path}`;
export const absoluteUrl = (path = "") => `${siteUrl}${path}`;

/** Every language version of one page, plus x-default for search engines. */
export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(locales.map((l) => [l, pathFor(l, path)])),
    "x-default": pathFor("en", path),
  };
}

type PageMeta = {
  locale: Locale;
  /** Path without the language, e.g. "/services/launch-site". Empty for home. */
  path?: string;
  title: string;
  description?: string;
  /** Keep the page out of search results (login, thank-you pages...). */
  noindex?: boolean;
  image?: string;
  type?: "website" | "article";
};

/**
 * One place that builds the canonical link, language alternates, Open Graph
 * and Twitter tags, so every page is described the same way.
 */
export function pageMetadata({ locale, path = "", title, description, noindex, image, type = "website" }: PageMeta): Metadata {
  const url = pathFor(locale, path);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}

// ---------------------------------------------------------------- JSON-LD

const personId = `${siteUrl}/#person`;

export function personJsonLd() {
  const photo = getProfilePhoto();
  return {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    url: siteUrl,
    jobTitle: "Full-stack & AI engineer",
    ...(photo ? { image: absoluteUrl(photo) } : {}),
    sameAs: activeSocial().map((s) => s.href),
    knowsAbout: [...site.stack],
  };
}

export function siteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: site.name,
        url: absoluteUrl(pathFor(locale)),
        inLanguage: locale,
        publisher: { "@id": personId },
      },
    ],
  };
}

export function breadcrumbJsonLd(locale: Locale, trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absoluteUrl(pathFor(locale, t.path)),
    })),
  };
}

type ProductLike = {
  name: string;
  tagline: string;
  description: string;
  priceCents: number | null;
  currency: string;
  imageUrl: string | null;
};

/** Structured data for a service, template or course page. */
export function productJsonLd(kind: "Service" | "Product" | "Course", p: ProductLike, locale: Locale, path: string) {
  const url = absoluteUrl(pathFor(locale, path));
  const offer =
    p.priceCents != null
      ? {
          "@type": "Offer",
          url,
          price: (p.priceCents / 100).toFixed(2),
          priceCurrency: p.currency.toUpperCase(),
          availability: "https://schema.org/InStock",
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": kind,
    name: p.name,
    description: p.tagline || p.description.slice(0, 200),
    url,
    inLanguage: locale,
    ...(p.imageUrl ? { image: p.imageUrl } : {}),
    ...(kind === "Product" ? { brand: { "@type": "Brand", name: site.name } } : { provider: { "@id": personId } }),
    ...(offer ? { offers: offer } : {}),
  };
}
