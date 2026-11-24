"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/newsletter-actions";
import type { Dict } from "@/i18n/dictionaries";

export function NewsletterForm({ locale, t }: { locale: string; t: Dict["newsletter"] }) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, null);

  if (state?.ok) {
    return <p role="status" className="text-sm font-medium text-emerald-300">{t.done}</p>;
  }

  return (
    <form action={action} className="max-w-sm">
      <input type="hidden" name="locale" value={locale} />
      <label htmlFor="newsletter-email" className="sr-only">{t.label}</label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          dir="ltr"
          autoComplete="email"
          placeholder={t.placeholder}
          className="field min-w-0 flex-1"
        />
        <button type="submit" disabled={pending} className="btn btn-primary shrink-0 !px-5">
          {pending ? t.sending : t.button}
        </button>
      </div>
      {/* Honeypot for bots. Hidden from people and screen readers. */}
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state && !state.ok && <p role="alert" className="mt-2 text-sm text-rose">{t.errors[state.code]}</p>}
    </form>
  );
}
