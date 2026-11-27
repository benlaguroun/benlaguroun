"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/newsletter-actions";
import type { Dict } from "@/i18n/dictionaries";

// Shown instead of the buy button while no payment method is set up.
// Sign-ups go to the newsletter list, tagged with the product they asked about.
type Props = { locale: string; slug: string; product: Dict["product"]; newsletter: Dict["newsletter"] };

export function NotifyForm({ locale, slug, product, newsletter }: Props) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, null);

  if (state?.ok) {
    return <p role="status" className="text-sm font-medium text-emerald-300">{product.notifyDone}</p>;
  }

  return (
    <form action={action} className="space-y-3">
      <p className="inline-block rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aqua">
        {product.comingSoon}
      </p>
      <p className="text-sm text-mute">{product.notifyBody}</p>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={`launch:${slug}`} />
      <label htmlFor={`notify-${slug}`} className="sr-only">{newsletter.label}</label>
      <input
        id={`notify-${slug}`}
        name="email"
        type="email"
        required
        dir="ltr"
        autoComplete="email"
        placeholder={newsletter.placeholder}
        className="field w-full"
      />
      {/* Honeypot for bots. Hidden from people and screen readers. */}
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? newsletter.sending : product.notifyButton}
      </button>
      {state && !state.ok && <p role="alert" className="text-sm text-rose">{newsletter.errors[state.code]}</p>}
    </form>
  );
}
