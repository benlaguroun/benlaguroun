import Link from "next/link";
import type { Product } from "@brand/db";
import { lp, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { formatPrice, productPath } from "@/lib/format";
import { BuyButton } from "./buy-button";
import { Check } from "./icons";

type Props = { product: Product; locale: Locale; signedIn: boolean; owned: boolean };

export function PurchasePanel({ product, locale, signedIn, owned }: Props) {
  const t = getDict(locale);
  const price = formatPrice(product.priceCents, product.currency, locale, t.product.customQuote);

  return (
    <aside className="glass sticky top-24 h-fit space-y-6 p-7">
      <div>
        <p className="eyebrow">{t.product.price}</p>
        <p className="display mt-2 text-5xl font-semibold">{price}</p>
        <p className="mt-2 text-xs text-mute">{t.product.oneTime}</p>
      </div>

      {owned ? (
        product.type === "COURSE" ? (
          <Link href={lp(locale, `/learn/${product.slug}`)} className="btn btn-primary w-full">
            {t.product.continueLearning}
          </Link>
        ) : product.deliveryUrl ? (
          <a href={product.deliveryUrl} className="btn btn-primary w-full" target="_blank" rel="noreferrer">
            {t.product.download}
          </a>
        ) : (
          <Link href={lp(locale, "/dashboard")} className="btn btn-primary w-full">
            {t.product.openLibrary}
          </Link>
        )
      ) : signedIn ? (
        <BuyButton
          productId={product.id}
          locale={locale}
          label={`${t.product.buyNow} · ${price}`}
          redirecting={t.product.redirecting}
          errors={t.errors}
        />
      ) : (
        <Link
          href={`${lp(locale, "/login")}?next=${encodeURIComponent(lp(locale, productPath(product)))}`}
          className="btn btn-primary w-full"
        >
          {t.product.loginToBuy} · {price}
        </Link>
      )}

      {product.features.length > 0 && (
        <ul className="space-y-3 border-t border-line pt-6 text-sm">
          {product.features.map((f) => (
            <li key={f} className="flex gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-aqua/15 text-aqua">
                <Check className="h-3 w-3" />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
