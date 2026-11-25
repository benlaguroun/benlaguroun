import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { formatPrice, paragraphs } from "@/lib/format";
import { ArrowBack, Check } from "@/components/icons";
import { Reveal } from "@/components/reveal";

// Built once, then reused for 10 minutes. Saving anything in the admin refreshes it straight away.
export const revalidate = 600;

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getService(slug: string) {
  const p = await prisma.product.findUnique({ where: { slug } });
  return p && p.type === "SERVICE" && p.published ? p : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const raw = await getService(slug);
  if (!raw) return {};
  const p = localize(raw, locale);
  return pageMetadata({ locale, path: `/services/${slug}`, title: p.name, description: p.tagline, type: "article" });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const raw = await getService(slug);
  if (!raw) notFound();
  const service = localize(raw, locale);

  return (
    <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr]">
      <JsonLd
        data={[
          productJsonLd("Service", service, locale, `/services/${slug}`),
          breadcrumbJsonLd(locale, [
            { name: t.pages.services.eyebrow, path: "/services" },
            { name: service.name, path: `/services/${slug}` },
          ]),
        ]}
      />
      <Reveal>
        <article>
          <Link href={lp(locale, "/services")} className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink">
            <ArrowBack /> {t.product.allServices}
          </Link>
          <p className="eyebrow mt-8">{t.product.types.SERVICE}</p>
          <h1 className="display mt-3 text-4xl font-semibold sm:text-6xl">
            <span className="text-gradient">{service.name}</span>
          </h1>
          <p className="mt-5 text-xl text-mute">{service.tagline}</p>
          <div className="mt-8 space-y-4 text-lg leading-relaxed">
            {paragraphs(service.description).map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </article>
      </Reveal>

      <Reveal delay={120}>
        <aside className="glass sticky top-24 h-fit space-y-6 p-7">
          <div>
            <p className="eyebrow">{service.priceCents != null ? t.product.startingAt : t.product.pricing}</p>
            <p className="display mt-2 text-5xl font-semibold">
              {formatPrice(service.priceCents, service.currency, locale, t.product.customQuote)}
            </p>
          </div>
          <Link href={`${lp(locale, "/contact")}?service=${service.slug}`} className="btn btn-primary w-full">
            {t.product.startProject}
          </Link>
          <ul className="space-y-3 border-t border-line pt-6 text-sm">
            {service.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-aqua/15 text-aqua">
                  <Check className="h-3 w-3" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </aside>
      </Reveal>
    </div>
  );
}
