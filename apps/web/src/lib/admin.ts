import { notFound } from "next/navigation";
import { lp, type Locale } from "@/i18n/config";
import { getSession, requireSession } from "@/lib/session";

export function isAdminUser(user: unknown) {
  return (user as { role?: string | null } | null | undefined)?.role === "ADMIN";
}

/**
 * Guard for admin pages. Visitors who aren't signed in are sent to the login
 * page; signed-in visitors who aren't admins get a 404 so the area stays hidden.
 * Call it in every admin page, not only the layout.
 */
export async function requireAdmin(locale: Locale) {
  const session = await requireSession(locale, lp(locale, "/admin"));
  if (!isAdminUser(session.user)) notFound();
  return session;
}

/** Guard for server actions: always re-check, never trust the page that rendered the form. */
export async function assertAdmin() {
  const session = await getSession();
  if (!session || !isAdminUser(session.user)) throw new Error("Forbidden");
  return session;
}
