"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";

type Props = {
  productId: string;
  locale: Locale;
  label: string;
  redirecting: string;
  errors: { signin: string; invalid: string; failed: string };
};

export function BuyButton({ productId, locale, label, redirecting, errors }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, locale }),
      });
      const data = (await res.json()) as { url?: string; code?: "signin" | "invalid" | "failed" };
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
    <div>
      <button type="button" onClick={buy} disabled={loading} className="btn btn-primary w-full">
        {loading ? redirecting : label}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-rose">{error}</p>}
    </div>
  );
}
