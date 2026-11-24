"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { lp, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

export function ForgotPasswordForm({ locale, t }: { locale: Locale; t: Dict["auth"] }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("sending");
    const email = String(new FormData(e.currentTarget).get("email"));

    const result = await authClient.requestPasswordReset({ email, redirectTo: lp(locale, "/reset-password") });
    if (result.error) {
      setError(t.forgot.error);
      setState("idle");
      return;
    }
    // The same answer whether or not the address has an account, on purpose.
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="glass p-8 text-center">
        <p className="display text-2xl font-semibold">{t.forgot.sentTitle}</p>
        <p className="mt-3 text-mute">{t.forgot.sentBody}</p>
        <Link href={lp(locale, "/login")} className="btn btn-glass mt-7">{t.forgot.back}</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-5 p-8">
      <div>
        <label htmlFor="email" className="label">{t.email}</label>
        <input id="email" name="email" type="email" required autoComplete="email" dir="ltr" className="field" />
      </div>
      {error && <p role="alert" className="text-sm text-rose">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full">
        {state === "sending" ? t.forgot.sending : t.forgot.button}
      </button>
      <p className="text-center text-sm">
        <Link href={lp(locale, "/login")} className="font-medium text-aqua hover:underline">{t.forgot.back}</Link>
      </p>
    </form>
  );
}
