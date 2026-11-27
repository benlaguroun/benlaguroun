import type { Metadata } from "next";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { notFound } from "next/navigation";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { pageMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { PageIntro } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

// Built once, then reused for 10 minutes. Saving anything in the admin refreshes it straight away.
export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDict(locale).pages.templates;
  return pageMetadata({ locale, path: "/templates", title: t.eyebrow, description: t.body });
}

export default async function Page({ params }: Props) {
  if (!site.shop.open) notFound();
  const locale = await resolveLocale(params);
  const t = getDict(locale).pages.templates;

  const items = await prisma.product.findMany({
    where: { type: "TEMPLATE", published: true },
    orderBy: { position: "asc" },
  });

  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.title} body={t.body} />
      <div className="wrap grid gap-5 py-16 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 90}>
            <ProductCard product={p} locale={locale} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
