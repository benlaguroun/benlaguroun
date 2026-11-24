"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { lp, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

export function ResetPasswordForm({ token, locale, t }: { token: string; locale: Locale; t: Dict["auth"] }) {
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) return setError(t.reset.mismatch);

    setState("saving");
    const result = await authClient.resetPassword({ newPassword: password, token });
    if (result.error) {
      setError(t.reset.error);
      setState("idle");
      return;
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="glass p-8 text-center">
        <p className="display text-2xl font-semibold">{t.reset.doneTitle}</p>
        <p className="mt-3 text-mute">{t.reset.doneBody}</p>
        <Link href={lp(locale, "/login")} className="btn btn-primary mt-7">{t.reset.login}</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-5 p-8">
      <div>
        <label htmlFor="password" className="label">{t.reset.password}</label>
        <input id="password" name="password" type="password" required minLength={8} dir="ltr" autoComplete="new-password" className="field" />
        <p className="mt-1.5 text-xs text-mute">{t.hint}</p>
      </div>
      <div>
        <label htmlFor="confirm" className="label">{t.reset.confirm}</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} dir="ltr" autoComplete="new-password" className="field" />
      </div>
      {error && <p role="alert" className="text-sm text-rose">{error}</p>}
      <button type="submit" disabled={state === "saving"} className="btn btn-primary w-full">
        {state === "saving" ? t.reset.saving : t.reset.button}
      </button>
    </form>
  );
}
