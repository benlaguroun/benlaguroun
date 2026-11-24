import Link from "next/link";
import type { ProductType } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

const CHOICES: { type: ProductType; title: string; body: string }[] = [
  { type: "SERVICE", title: "Service", body: "Work you do for clients. Shows a custom quote or a starting price and a contact button." },
  { type: "TEMPLATE", title: "Template", body: "A file or kit people download after they pay." },
  { type: "COURSE", title: "Course", body: "Lessons in modules, unlocked after payment. You add the lessons next." },
];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; error?: string }>;
};

export default async function NewProductPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { type, error } = await searchParams;
  const chosen = CHOICES.find((c) => c.type === type);
  const base = `/${locale}/admin/products`;

  return (
    <>
      <Link href={base} className="text-sm text-mute hover:text-ink">← All products</Link>
      <div className="mt-4">
        <AdminHeading title={chosen ? `New ${chosen.title.toLowerCase()}` : "New product"} />
      </div>
      <ErrorBanner message={error} />

      {chosen ? (
        <ProductForm locale={locale} newType={chosen.type} />
      ) : (
        <>
          <p className="mb-5 text-sm text-mute">What are you adding?</p>
          <div className="grid gap-4 md:grid-cols-3">
            {CHOICES.map((c) => (
              <Link key={c.type} href={`${base}/new?type=${c.type}`} className="glass block p-6 transition hover:border-aqua/50">
                <p className="display text-xl font-semibold">{c.title}</p>
                <p className="mt-2 text-sm text-mute">{c.body}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
