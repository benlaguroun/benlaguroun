"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { defaultLocale, isLocale, lp, type Locale } from "@/i18n/config";
import { sendWelcomeEmail } from "@/lib/newsletter";
import { clientIp, rateLimited } from "@/lib/rate-limit";

export type SubscribeState = { ok: true } | { ok: false; code: "email" | "failed" } | null;

export async function subscribe(_prev: SubscribeState, fd: FormData): Promise<SubscribeState> {
  // Honeypot: people leave this hidden field empty.
  if (String(fd.get("website") ?? "").trim()) return { ok: true };

  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, code: "email" };

  // At most 5 sign-ups per visitor every 10 minutes.
  if (rateLimited(`newsletter:${await clientIp()}`, 5, 10 * 60_000)) return { ok: false, code: "failed" };

  const l = String(fd.get("locale") ?? "");
  const locale: Locale = isLocale(l) ? l : defaultLocale;

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    // Already subscribed: say "ok" without sending anything, so nobody can use
    // this form to find out who is on the list.
    if (existing?.active) return { ok: true };

    const sub = existing
      ? await prisma.subscriber.update({ where: { email }, data: { active: true, unsubscribedAt: null, locale } })
      : await prisma.subscriber.create({ data: { email, locale, source: "footer" } });

    after(() => sendWelcomeEmail({ email: sub.email, locale, token: sub.token }));
    return { ok: true };
  } catch (err) {
    console.error("Newsletter sign-up failed", err);
    return { ok: false, code: "failed" };
  }
}

export async function unsubscribe(fd: FormData) {
  const token = String(fd.get("token") ?? "");
  const l = String(fd.get("locale") ?? "");
  const locale: Locale = isLocale(l) ? l : defaultLocale;
  if (token) {
    await prisma.subscriber.updateMany({ where: { token }, data: { active: false, unsubscribedAt: new Date() } });
  }
  redirect(`${lp(locale, "/unsubscribe")}?done=1`);
}
