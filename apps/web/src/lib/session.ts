import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { lp, type Locale } from "@/i18n/config";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** For protected pages: returns the session or redirects to the login page. */
export async function requireSession(locale: Locale, nextPath: string) {
  const session = await getSession();
  if (!session) redirect(`${lp(locale, "/login")}?next=${encodeURIComponent(nextPath)}`);
  return session;
}

/** Only allow same-site relative redirects after login. */
export function safeNext(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
