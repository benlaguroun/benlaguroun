import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/resolve";
import { LegalDocument, legalMetadata } from "@/components/legal-document";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return legalMetadata(await resolveLocale(params), "terms");
}

export default async function Page({ params }: Props) {
  return <LegalDocument locale={await resolveLocale(params)} docKey="terms" />;
}
