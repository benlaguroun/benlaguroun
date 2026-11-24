import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { productPath } from "@/lib/format";
import { resolveLocale } from "@/i18n/resolve";
import { AdminHeading, ErrorBanner, Pill } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ProductForm } from "@/components/admin/product-form";
import { deleteProduct } from "../../catalog-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditProductPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { id } = await params;
  const { error, saved } = await searchParams;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      course: { select: { modules: { select: { lessons: { select: { id: true } } } } } },
      _count: { select: { orders: true } },
    },
  });
  if (!product) notFound();

  const base = `/${locale}/admin/products`;
  const modules = product.course?.modules.length ?? 0;
  const lessons = product.course?.modules.reduce((n, m) => n + m.lessons.length, 0) ?? 0;

  return (
    <>
      <Link href={base} className="text-sm text-mute hover:text-ink">← All products</Link>
      <div className="mt-4">
        <AdminHeading title={product.name}>
          <Pill>{product.type.toLowerCase()}</Pill>
          <Pill tone={product.published ? "good" : "warn"}>{product.published ? "published" : "hidden"}</Pill>
          <Link href={`/${locale}${productPath(product)}`} target="_blank" className="btn btn-glass !px-4 !py-2">View on site</Link>
        </AdminHeading>
      </div>

      <ErrorBanner message={error} />
      {saved && (
        <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">Saved.</p>
      )}

      {product.type === "COURSE" && (
        <Link href={`${base}/${product.id}/curriculum`} className="glass mb-6 flex items-center justify-between gap-4 p-5 transition hover:border-aqua/50">
          <div>
            <p className="font-medium">Curriculum</p>
            <p className="mt-1 text-sm text-mute">
              {modules} module{modules === 1 ? "" : "s"} · {lessons} lesson{lessons === 1 ? "" : "s"}. Add, edit and reorder the lessons.
            </p>
          </div>
          <span className="btn btn-primary !px-4 !py-2">Edit lessons</span>
        </Link>
      )}

      <ProductForm locale={locale} product={product} />

      <div className="mt-10 border-t border-line pt-6">
        <p className="text-sm font-medium">Delete this product</p>
        {product._count.orders > 0 ? (
          <p className="mt-1 max-w-xl text-sm text-mute">
            It has {product._count.orders} order{product._count.orders === 1 ? "" : "s"}, so it can't be deleted without breaking your sales history.
            Untick “Published” above to hide it from the site instead.
          </p>
        ) : (
          <form action={deleteProduct} className="mt-3">
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="locale" value={locale} />
            <ConfirmButton message={`Delete “${product.name}” for good? This can't be undone.`}>Delete product</ConfirmButton>
          </form>
        )}
      </div>
    </>
  );
}
