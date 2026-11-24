import Link from "next/link";
import { prisma, type ProductType } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { money } from "@/lib/admin-format";
import { productPath } from "@/lib/format";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, Empty, ErrorBanner, Filters, Pill } from "@/components/admin/ui";
import { setProductPublished } from "../catalog-actions";

export const dynamic = "force-dynamic";

const TYPES: { key: ProductType; label: string }[] = [
  { key: "SERVICE", label: "Services" },
  { key: "TEMPLATE", label: "Templates" },
  { key: "COURSE", label: "Courses" },
];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; error?: string; saved?: string }>;
};

export default async function AdminProductsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { type, error, saved } = await searchParams;
  const filter = TYPES.find((t) => t.key === type)?.key;

  const products = await prisma.product.findMany({
    where: filter ? { type: filter } : undefined,
    orderBy: [{ type: "asc" }, { position: "asc" }, { createdAt: "asc" }],
    include: { course: { select: { modules: { select: { lessons: { select: { id: true } } } } } } },
  });

  const base = `/${locale}/admin/products`;

  return (
    <>
      <AdminHeading title="Products">
        <Link href={`${base}/new`} className="btn btn-primary !px-4 !py-2">New product</Link>
      </AdminHeading>
      <p className="-mt-2 mb-6 max-w-2xl text-sm text-mute">
        Everything you sell: services, templates and courses. Unpublished products are hidden from the site but kept here.
      </p>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      <Filters
        current={filter ?? "all"}
        items={[
          { key: "all", label: "All", href: base },
          ...TYPES.map((t) => ({ key: t.key, label: t.label, href: `${base}?type=${t.key}` })),
        ]}
      />

      {products.length === 0 ? (
        <Empty>No products here yet.</Empty>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => {
            const lessons = p.course?.modules.reduce((n, m) => n + m.lessons.length, 0);
            return (
              <li key={p.id} className="glass flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`${base}/${p.id}`} className="font-medium hover:text-aqua">{p.name}</Link>
                    <Pill>{p.type.toLowerCase()}</Pill>
                    <Pill tone={p.published ? "good" : "warn"}>{p.published ? "published" : "hidden"}</Pill>
                    {p.featured && <Pill tone="info">featured</Pill>}
                  </div>
                  <p className="mt-1 text-sm text-mute">
                    {p.priceCents != null ? money(p.priceCents, p.currency) : "Custom quote"}
                    {lessons != null && ` · ${lessons} lesson${lessons === 1 ? "" : "s"}`}
                    {p.type === "TEMPLATE" && !p.deliveryUrl && <span className="text-amber-300"> · no download link yet</span>}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/${locale}${productPath(p)}`} target="_blank" className="btn btn-glass !px-4 !py-2">View</Link>
                  <form action={setProductPublished}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="published" value={p.published ? "0" : "1"} />
                    <button type="submit" className="btn btn-glass !px-4 !py-2">{p.published ? "Unpublish" : "Publish"}</button>
                  </form>
                  <Link href={`${base}/${p.id}`} className="btn btn-primary !px-4 !py-2">Edit</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
