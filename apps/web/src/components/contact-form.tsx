"use client";

import { useActionState } from "react";
import { createLead, type LeadState } from "@/app/actions";

export function ContactForm({
  services,
  defaultInterest,
}: {
  services: { slug: string; name: string }[];
  defaultInterest?: string;
}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(createLead, null);

  if (state?.ok) {
    return (
      <div className="card p-8 text-center">
        <p className="display text-2xl font-semibold">Message sent</p>
        <p className="mt-2 text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card space-y-4 p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" required className="field" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" required className="field" autoComplete="email" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="interest" className="label">I'm interested in</label>
          <select id="interest" name="interest" defaultValue={defaultInterest ?? ""} className="field">
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="label">Budget (optional)</label>
          <select id="budget" name="budget" defaultValue="" className="field">
            <option value="">Prefer not to say</option>
            <option>Under $1,000</option>
            <option>$1,000 – $3,000</option>
            <option>$3,000 – $10,000</option>
            <option>$10,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label">Tell me about your project</label>
        <textarea id="message" name="message" required rows={6} className="field" />
      </div>

      {/* Honeypot for bots. Hidden from people and screen readers. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
