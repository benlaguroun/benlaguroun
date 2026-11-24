import Link from "next/link";
import type { Product } from "@brand/db";
import { lp, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { localize } from "@/i18n/content";
import { formatPrice, productPath } from "@/lib/format";
import { Arrow, TypeIcon } from "./icons";

const tone = {
  SERVICE: { icon: "from-iris to-indigo-500", glow: "bg-iris/30" },
  TEMPLATE: { icon: "from-aqua to-sky-500", glow: "bg-aqua/25" },
  COURSE: { icon: "from-rose to-iris", glow: "bg-rose/25" },
} as const;

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDict(locale);
  const p = localize(product, locale);
  const c = tone[p.type];

  return (
    <Link
      href={lp(locale, productPath(p))}
      className="glass spot group flex h-full flex-col p-6"
    >
      <span className={`deco -end-10 -top-10 h-32 w-32 rounded-full blur-3xl ${c.glow}`} />

      <div className="flex items-center justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg ${c.icon}`}>
          <TypeIcon type={p.type} className="h-5 w-5" />
        </span>
        <span className="chip">{t.product.types[p.type]}</span>
      </div>

      <h3 className="display mt-5 text-xl font-semibold">{p.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{p.tagline}</p>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <span className="font-semibold">
          {p.type === "SERVICE" && p.priceCents != null ? `${t.product.from} ` : ""}
          {formatPrice(p.priceCents, p.currency, locale, t.product.customQuote)}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-aqua">
          {t.product.view}
          <Arrow className="transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
