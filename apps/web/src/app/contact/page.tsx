import type { Metadata } from "next";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/section-heading";

export const metadata: Metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { service } = await searchParams;
  const services = await prisma.product.findMany({
    where: { type: "SERVICE", published: true },
    orderBy: { position: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Let's talk about your project"
        body={`Prefer email? Write to ${site.email}. Otherwise use the form and I'll reply within two working days.`}
      />
      <div className="wrap max-w-2xl py-12">
        <ContactForm services={services} defaultInterest={service} />
      </div>
    </>
  );
}
