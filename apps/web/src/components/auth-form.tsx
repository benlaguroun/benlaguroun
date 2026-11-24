"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { lp, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

export function AuthForm({
  mode,
  next,
  locale,
  t,
}: {
  mode: "login" | "signup";
  next: string;
  locale: Locale;
  t: Dict["auth"];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const name = String(form.get("name") ?? "");

    const result =
      mode === "signup"
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(t.error);
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  const other = mode === "signup" ? "/login" : "/signup";

  return (
    <form onSubmit={onSubmit} className="glass space-y-5 p-8">
      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="label">{t.name}</label>
          <input id="name" name="name" required autoComplete="name" className="field" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="label">{t.email}</label>
        <input id="email" name="email" type="email" required autoComplete="email" dir="ltr" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">{t.password}</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          dir="ltr"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="field"
        />
        {mode === "signup" && <p className="mt-1.5 text-xs text-mute">{t.hint}</p>}
        {mode === "login" && (
          <p className="mt-2 text-end text-sm">
            <Link href={lp(locale, "/forgot-password")} className="text-mute hover:text-aqua hover:underline">
              {t.forgotLink}
            </Link>
          </p>
        )}
      </div>

      {error && <p role="alert" className="text-sm text-rose">{error}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? t.wait : mode === "signup" ? t.signupBtn : t.loginBtn}
      </button>

      <p className="text-center text-sm text-mute">
        {mode === "signup" ? t.haveAccount : t.newHere}{" "}
        <Link href={`${lp(locale, other)}?next=${encodeURIComponent(next)}`} className="font-medium text-aqua hover:underline">
          {mode === "signup" ? t.loginBtn : t.signupBtn}
        </Link>
      </p>
    </form>
  );
}
