"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next: string }) {
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
      setError(result.error.message ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  const other = mode === "signup" ? "/login" : "/signup";

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-7">
      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" required autoComplete="name" className="field" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="field"
        />
        {mode === "signup" && <p className="mt-1.5 text-xs text-muted">At least 8 characters.</p>}
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        {mode === "signup" ? "Already have an account? " : "New here? "}
        <Link href={`${other}?next=${encodeURIComponent(next)}`} className="font-medium text-accent hover:underline">
          {mode === "signup" ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
