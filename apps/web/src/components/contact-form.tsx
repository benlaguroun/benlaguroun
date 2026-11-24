"use client";

import { useActionState } from "react";
import { createLead, type LeadState } from "@/app/actions";
import type { Dict } from "@/i18n/dictionaries";

// Stored in the database in English, whatever language the visitor uses.
const BUDGET_VALUES = ["Under $1,000", "$1,000 – $3,000", "$3,000 – $10,000", "$10,000+"];

export function ContactForm({
  services,
  defaultInterest,
  t,
}: {
  services: { slug: string; name: string }[];
  defaultInterest?: string;
  t: Dict["contactForm"];
}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(createLead, null);

  if (state?.ok) {
    return (
      <div className="glass p-10 text-center">
        <p className="display text-3xl font-semibold text-gradient">{t.sentTitle}</p>
        <p className="mt-3 text-mute">{t.sentBody}</p>
      </div>
    );
  }

  return (
    <form action={action} className="glass space-y-5 p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">{t.name}</label>
          <input id="name" name="name" required className="field" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="label">{t.email}</label>
          <input id="email" name="email" type="email" required dir="ltr" className="field" autoComplete="email" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="interest" className="label">{t.interest}</label>
          <select id="interest" name="interest" defaultValue={defaultInterest ?? ""} className="field">
            <option value="">{t.notSure}</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="label">{t.budget}</label>
          <select id="budget" name="budget" defaultValue="" className="field">
            <option value="">{t.noBudget}</option>
            {BUDGET_VALUES.map((v, i) => (
              <option key={v} value={v}>{t.budgetOptions[i] ?? v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label">{t.message}</label>
        <textarea id="message" name="message" required rows={6} className="field" />
      </div>

      {/* Honeypot for bots. Hidden from people and screen readers. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state && !state.ok && <p role="alert" className="text-sm text-rose">{t.errors[state.code]}</p>}

      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}
