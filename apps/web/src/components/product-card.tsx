import Link from "next/link";
import type { Product } from "@brand/db";
import { formatPrice, productHref } from "@/lib/format";

const label = { SERVICE: "Service", TEMPLATE: "Template", COURSE: "Course" } as const;

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={productHref(product)}
      className="card group flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:border-ink"
    >
      <span className="chip self-start">{label[product.type]}</span>
      <h3 className="display mt-4 text-xl font-semibold">{product.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{product.tagline}</p>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm font-semibold">
          {product.type === "SERVICE" && product.priceCents != null ? "From " : ""}
          {formatPrice(product.priceCents, product.currency)}
        </span>
        <span className="text-sm font-medium text-accent transition group-hover:translate-x-0.5">View →</span>
      </div>
    </Link>
  );
}
