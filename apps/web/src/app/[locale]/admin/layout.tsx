import type { Metadata } from "next";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const newMessages = await prisma.lead.count({ where: { status: "NEW" } });

  return (
    <div className="wrap grid gap-8 py-10 lg:grid-cols-[13rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <AdminNav locale={locale} newMessages={newMessages} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
