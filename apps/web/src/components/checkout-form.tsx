"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { Check, Lock } from "./icons";

export type Method = { name: string; title: string; body: string };

type Props = {
  productId: string;
  locale: Locale;
  methods: Method[];
  payLabel: string;
  processing: string;
  secureNote: string;
  errors: { signin: string; invalid: string; failed: string; method: string };
};

/** Pick a payment method and go to its secure payment page. */
export function CheckoutForm({ productId, locale, methods, payLabel, processing, secureNote, errors }: Props) {
  const [method, setMethod] = useState(methods[0]?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!method) return setError(errors.method);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, locale, provider: method }),
      });
      const data = (await res.json()) as { url?: string; code?: keyof typeof errors };
      if (!res.ok || !data.url) {
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

      <button type="submit" disabled={loading} className="btn btn-primary w-full !py-3.5 text-base">
        {loading ? processing : payLabel}
      </button>
      {error && <p role="alert" className="text-sm text-rose">{error}</p>}

      <p className="flex items-start gap-2 text-xs text-mute">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {secureNote}
      </p>
    </form>
  );
}
