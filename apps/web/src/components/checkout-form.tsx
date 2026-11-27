"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { Check, Lock } from "./icons";

export type Method = { name: string; title: string; body: string };

type CouponLabels = { label: string; apply: string; applying: string; applied: string; total: string; free: string; remove: string };

type Props = {
  productId: string;
  locale: Locale;
  methods: Method[];
  payLabel: string;
  /** The "Pay {price}" text, so the button can show the discounted total. */
  payTemplate: string;
  processing: string;
  secureNote: string;
  coupon: CouponLabels;
  errors: { signin: string; invalid: string; failed: string; method: string; verify: string; coupon: string; many: string };
};

type Applied = { code: string; discount: string; total: string; free: boolean };

/** Pick a payment method and go to its secure payment page. */
export function CheckoutForm({ productId, locale, methods, payLabel, payTemplate, processing, secureNote, coupon, errors }: Props) {
  const [method, setMethod] = useState(methods[0]?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<Applied | null>(null);
  const [checking, setChecking] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Asks the server what the code would do. Only a preview: the server checks it again when you pay.
  async function applyCode() {
    const typed = code.trim();
    if (!typed) return;
    setChecking(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, locale, code: typed }),
      });
      const data = (await res.json()) as { ok?: boolean; code?: string; free?: boolean; discount?: string; total?: string };
      if (data.ok && data.discount && data.total) {
        setApplied({ code: typed, discount: data.discount, total: data.total, free: !!data.free });
      } else {
        setApplied(null);
        setCouponError(data.code === "many" ? errors.many : errors.coupon);
      }
    } catch {
      setCouponError(errors.failed);
    }
    setChecking(false);
  }

  function removeCode() {
    setApplied(null);
    setCode("");
    setCouponError(null);
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!method && !applied?.free) return setError(errors.method);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, locale, provider: method, ...(applied ? { coupon: applied.code } : {}) }),
      });
      const data = (await res.json()) as { url?: string; code?: keyof typeof errors };
      if (!res.ok || !data.url) {
        if (data.code === "coupon") setApplied(null);
      setError(errors[data.code ?? "failed"]);
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(errors.failed);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={pay} className="space-y-5">
      {!applied?.free && (
      <fieldset className="space-y-3">
        {methods.map((m) => {
          const selected = method === m.name;
          return (
            <label
              key={m.name}
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition ${
                selected ? "border-aqua/60 bg-aqua/10" : "border-line bg-white/5 hover:bg-white/8"
              }`}
            >
              <input
                type="radio"
                name="method"
                value={m.name}
                checked={selected}
                onChange={() => setMethod(m.name)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                  selected ? "border-aqua bg-aqua text-void" : "border-line"
                }`}
              >
                {selected && <Check className="h-3 w-3" />}
              </span>
              <span>
                <span className="block font-semibold">{m.title}</span>
                <span className="mt-1 block text-sm text-mute">{m.body}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
      )}

      <div>
        <label htmlFor="coupon-code" className="label">{coupon.label}</label>
        {applied ? (
          <div className="rounded-xl border border-aqua/40 bg-aqua/10 p-4 text-sm">
            <p className="font-medium">{coupon.applied.replace("{discount}", applied.discount)}</p>
            {!applied.free && <p className="mt-1 text-mute">{coupon.total.replace("{total}", applied.total)}</p>}
            <button type="button" onClick={removeCode} className="mt-2 text-xs text-aqua underline">{coupon.remove}</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              id="coupon-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void applyCode();
                }
              }}
              dir="ltr"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={32}
              className="field"
            />
            <button type="button" onClick={applyCode} disabled={checking || !code.trim()} className="btn btn-glass shrink-0">
              {checking ? coupon.applying : coupon.apply}
            </button>
          </div>
        )}
        {couponError && <p role="alert" className="mt-2 text-sm text-rose">{couponError}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full !py-3.5 text-base">
        {loading ? processing : applied ? (applied.free ? coupon.free : payTemplate.replace("{price}", applied.total)) : payLabel}
      </button>
      {error && <p role="alert" className="text-sm text-rose">{error}</p>}

      <p className="flex items-start gap-2 text-xs text-mute">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {secureNote}
      </p>
    </form>
  );
}
