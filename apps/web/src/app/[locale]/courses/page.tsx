import type { Metadata } from "next";
import { prisma } from "@brand/db";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { ProductCard } from "@/components/product-card";
import { PageIntro } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getDict(locale).pages.courses.eyebrow };
}

export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale).pages.courses;

  const items = await prisma.product.findMany({
    where: { type: "COURSE", published: true },
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
