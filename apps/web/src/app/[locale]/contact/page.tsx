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
  searchParams: Promise<{ service?: string; demo?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDict(locale).pages.contact;
  return pageMetadata({ locale, path: "/contact", title: t.eyebrow, description: t.body.replace("{email}", site.email) });
}

export default async function ContactPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const { service, demo } = await searchParams;

  // "Request a demo" on a project page lands here with the message started.
  let defaultMessage: string | undefined;
  if (demo) {
    const row = await prisma.project.findUnique({ where: { slug: demo }, select: { title: true, translations: true } });
    if (row) defaultMessage = fill(t.project.demoMessage, { title: localize(row, locale).title });
  }

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
        {site.booking.url && (
          <Reveal>
            <div className="glass mb-10 flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="display text-xl font-semibold">{t.pages.contact.bookTitle}</h2>
                <p className="mt-1 text-mute">{t.pages.contact.bookBody}</p>
              </div>
              <a href={site.booking.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary shrink-0">
                {t.pages.contact.bookCta}
              </a>
            </div>
            <p className="mb-6 text-center text-sm text-mute">{t.pages.contact.orForm}</p>
          </Reveal>
        )}
        <Reveal>
          <ContactForm services={services} defaultInterest={service} defaultMessage={defaultMessage} t={t.contactForm} />
        </Reveal>
      </div>
    </>
  );
}
