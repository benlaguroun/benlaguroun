import type { Metadata } from "next";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { localize } from "@/i18n/content";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { PageIntro } from "@/components/section-heading";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDict(locale).pages.contact;
  return pageMetadata({ locale, path: "/contact", title: t.eyebrow, description: t.body.replace("{email}", site.email) });
}

export default async function ContactPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const { service } = await searchParams;

  const rows = await prisma.product.findMany({
    where: { type: "SERVICE", published: true },
    orderBy: { position: "asc" },
  });
  const services = rows.map((r) => ({ slug: r.slug, name: localize(r, locale).name }));

  return (
    <>
      <PageIntro
        eyebrow={t.pages.contact.eyebrow}
        title={t.pages.contact.title}
        body={fill(t.pages.contact.body, { email: site.email })}
      />
      <div className="wrap max-w-2xl py-14">
        <Reveal>
          <ContactForm services={services} defaultInterest={service} t={t.contactForm} />
        </Reveal>
      </div>
    </>
  );
}
