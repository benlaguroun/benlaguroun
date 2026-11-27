import Link from "next/link";
import type { Product } from "@brand/db";
import { lp, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { formatPrice } from "@/lib/format";
import { availableProviders } from "@/lib/payments";
import { Check } from "./icons";
import { NotifyForm } from "./notify-form";

type Props = { product: Product; locale: Locale; signedIn: boolean; owned: boolean };

export function PurchasePanel({ product, locale, signedIn, owned }: Props) {
  const t = getDict(locale);
  const price = formatPrice(product.priceCents, product.currency, locale, t.product.customQuote);
  // Not for sale yet (flagged coming soon, or no payment method set up): email form instead of a buy button.
  const canBuy = !product.comingSoon && availableProviders(product.currency).length > 0;

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
        ) : product.deliveryFile || product.deliveryUrl ? (
          <a href={`/api/download/${product.id}`} className="btn btn-primary w-full">
            {t.product.download}
          </a>
        ) : (
          <Link href={lp(locale, "/dashboard")} className="btn btn-primary w-full">
            {t.product.openLibrary}
          </Link>
        )
      ) : !canBuy ? (
        <NotifyForm locale={locale} slug={product.slug} product={t.product} newsletter={t.newsletter} />
      ) : (
        <Link
          href={
            signedIn
              ? lp(locale, `/checkout/${product.slug}`)
              : `${lp(locale, "/login")}?next=${encodeURIComponent(lp(locale, `/checkout/${product.slug}`))}`
          }
          className="btn btn-primary w-full"
        >
          {signedIn ? t.product.buyNow : t.product.loginToBuy} · {price}
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
