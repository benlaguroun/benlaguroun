import Link from "next/link";
import type { Product } from "@brand/db";
import { formatPrice, productHref } from "@/lib/format";
import { BuyButton } from "./buy-button";

type Props = {
  product: Product;
  signedIn: boolean;
  owned: boolean;
};

export function PurchasePanel({ product, signedIn, owned }: Props) {
  const price = formatPrice(product.priceCents, product.currency);

  return (
    <aside className="card sticky top-24 space-y-5 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Price</p>
        <p className="display mt-1 text-4xl font-semibold">{price}</p>
        <p className="mt-1 text-xs text-muted">One-time payment. No subscription.</p>
      </div>

      {owned ? (
        product.type === "COURSE" ? (
          <Link href={`/learn/${product.slug}`} className="btn-primary w-full">
            Continue learning
          </Link>
        ) : product.deliveryUrl ? (
          <a href={product.deliveryUrl} className="btn-primary w-full" target="_blank" rel="noreferrer">
            Download
          </a>
        ) : (
          <Link href="/dashboard" className="btn-primary w-full">
            Open my library
          </Link>
        )
      ) : signedIn ? (
        <BuyButton productId={product.id} label={`Buy now · ${price}`} />
      ) : (
        <Link href={`/login?next=${encodeURIComponent(productHref(product))}`} className="btn-primary w-full">
          Log in to buy · {price}
        </Link>
      )}

      {product.features.length > 0 && (
        <ul className="space-y-2 border-t border-line pt-5 text-sm">
          {product.features.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-accent" aria-hidden>✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
