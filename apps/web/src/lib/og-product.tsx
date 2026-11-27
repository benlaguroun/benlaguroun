import { prisma } from "@brand/db";
import { localize } from "@/i18n/content";
import { formatPrice } from "@/lib/format";
import { ogCard, ogLocale } from "@/lib/og";

const kicker = { SERVICE: "Service", TEMPLATE: "Template", COURSE: "Course" } as const;

/** The share-preview picture for a service, template or course page. */
export async function productOgImage(rawLocale: string, slug: string) {
  const locale = ogLocale(rawLocale);
  const raw = await prisma.product.findUnique({ where: { slug } });
  if (!raw || !raw.published) return ogCard({ kicker: "Ben Laguroun", title: "Not found" });
  const p = localize(raw, locale);
  const price = formatPrice(p.priceCents, p.currency, locale === "fr" ? "fr" : "en", locale === "fr" ? "Sur devis" : "Custom quote");
  const badge = p.comingSoon ? (locale === "fr" ? "Bientôt disponible" : "Coming soon") : price;
  return ogCard({ kicker: kicker[p.type], title: p.name, subtitle: p.tagline, badge });
}
