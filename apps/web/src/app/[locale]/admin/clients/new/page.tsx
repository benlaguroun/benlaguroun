import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner } from "@/components/admin/ui";
import { ClientForm } from "@/components/admin/client-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function NewClientPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { error } = await searchParams;

  return (
    <>
      <Link href={`/${locale}/admin/clients`} className="text-sm text-mute hover:text-ink">← All clients</Link>
      <div className="mt-4">
        <AdminHeading title="New client" />
      </div>
      <ErrorBanner message={error} />
      <ClientForm locale={locale} />
    </>
  );
}
