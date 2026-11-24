import type { Metadata, Viewport } from "next";
import { Cairo, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { isLocale, localeMeta, locales } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Aurora } from "@/components/aurora";
import { CursorGlow } from "@/components/cursor-glow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site-url";
import "../globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#05060b", colorScheme: "dark" };

// Site-wide defaults. Each page adds its own title, canonical link and
// language alternates with pageMetadata() from lib/seo.ts.
export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    metadataBase: new URL(siteUrl),
    applicationName: site.name,
    title: { default: `${site.name} | ${t.meta.title}`, template: `%s | ${site.name}` },
    description: t.meta.description,
    authors: [{ name: site.name, url: siteUrl }],
    creator: site.name,
    formatDetection: { telephone: false },
    // Paste the code from Google Search Console into GOOGLE_SITE_VERIFICATION.
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      dir={localeMeta[locale].dir}
      className={`${grotesk.variable} ${inter.variable} ${cairo.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Aurora />
        <CursorGlow />
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
