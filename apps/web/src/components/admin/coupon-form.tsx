import type { Coupon } from "@brand/db";
import { saveCoupon } from "@/app/[locale]/admin/catalog-actions";

type ProductOption = { id: string; name: string };

export function CouponForm({ locale, products, item }: { locale: string; products: ProductOption[]; item?: Coupon }) {
  const k = item?.id ?? "new";
  const kind = item?.amountOffCents ? "amount" : "percent";
  return (
    <form action={saveCoupon} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {item && <input type="hidden" name="id" value={item.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`code-${k}`} className="label">Code *</label>
          <input id={`code-${k}`} name="code" required dir="ltr" maxLength={32} defaultValue={item?.code} placeholder="LAUNCH20" className="field uppercase" />
          <p className="mt-1 text-xs text-mute">What the buyer types. Capitals are added for you.</p>
        </div>
        <div>
          <label htmlFor={`note-${k}`} className="label">Note (only you see it)</label>
          <input id={`note-${k}`} name="note" defaultValue={item?.note ?? ""} placeholder="Launch week, newsletter list…" className="field" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor={`kind-${k}`} className="label">Takes off</label>
          <select id={`kind-${k}`} name="kind" defaultValue={kind} className="field">
            <option value="percent">A percentage</option>
            <option value="amount">A fixed amount</option>
          </select>
        </div>
        <div>
          <label htmlFor={`percent-${k}`} className="label">Percentage (1 to 100)</label>
          <input id={`percent-${k}`} name="percent" type="number" min={1} max={100} dir="ltr" defaultValue={item?.percentOff ?? 20} className="field" />
          <p className="mt-1 text-xs text-mute">100 makes the product free.</p>
        </div>
        <div>
          <label htmlFor={`amount-${k}`} className="label">Amount (if fixed)</label>
          <input id={`amount-${k}`} name="amount" inputMode="decimal" dir="ltr" defaultValue={item?.amountOffCents ? (item.amountOffCents / 100).toString() : ""} placeholder="10" className="field" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor={`product-${k}`} className="label">Works on</label>
          <select id={`product-${k}`} name="productId" defaultValue={item?.productId ?? ""} className="field">
            <option value="">Every product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`max-${k}`} className="label">Can be used (times)</label>
          <input id={`max-${k}`} name="maxRedemptions" type="number" min={1} dir="ltr" defaultValue={item?.maxRedemptions ?? ""} placeholder="Unlimited" className="field" />
        </div>
        <div>
          <label htmlFor={`exp-${k}`} className="label">Last day it works</label>
          <input id={`exp-${k}`} name="expiresAt" type="date" dir="ltr" defaultValue={item?.expiresAt ? item.expiresAt.toISOString().slice(0, 10) : ""} className="field" />
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input type="checkbox" name="active" defaultChecked={item?.active ?? true} className="h-4 w-4 accent-[var(--color-aqua)]" />
        Switched on
      </label>

      <button type="submit" className="btn btn-primary">{item ? "Save changes" : "Create coupon"}</button>
    </form>
  );
}
