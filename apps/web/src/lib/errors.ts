import { createHash } from "node:crypto";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { emailConfigured, esc, ownerEmail, sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site-url";

export type ErrorSource = "server" | "payment" | "webhook" | "email";

// Errors from normal navigation, not problems.
const IGNORED = /NEXT_REDIRECT|NEXT_NOT_FOUND|NEXT_HTTP_ERROR_FALLBACK|AbortError|aborted/i;

// Long unbroken strings in an error are often keys or tokens. Never store them.
const scrub = (text: string) => text.replace(/[A-Za-z0-9_\-+/=]{32,}/g, "[redacted]");

/** At most one alert email per distinct error per hour. */
const ALERT_EVERY_MS = 60 * 60_000;

/**
 * Records an error in the admin (Errors page) and emails you about it. Repeats
 * of the same error only raise a counter, so a failing payment provider gives
 * you one email an hour, not a thousand. It never throws, so it is safe to call
 * from inside any catch block.
 */
export async function reportError(source: ErrorSource, error: unknown, context?: string) {
  try {
    const err = error instanceof Error ? error : new Error(typeof error === "string" ? error : JSON.stringify(error));
    if (IGNORED.test(err.message)) return;

    const message = scrub(err.message).slice(0, 500) || "Unknown error";
    const stack = err.stack ? scrub(err.stack).slice(0, 4000) : null;
    const firstFrame = stack?.split("\n").find((l) => l.trim().startsWith("at "))?.trim() ?? "";
    const fingerprint = createHash("sha256").update(`${source}|${message}|${firstFrame}`).digest("hex").slice(0, 32);
    const path = context ? scrub(context).slice(0, 200) : null;

    const row = await prisma.errorLog.upsert({
      where: { fingerprint },
      create: { fingerprint, source, message, stack, path },
      // A repeat reopens an error you had marked as resolved.
      update: { count: { increment: 1 }, lastSeen: new Date(), resolved: false, ...(path ? { path } : {}) },
    });

    // Claim the right to send the alert, so two simultaneous failures send one email.
    const claimed = await prisma.errorLog.updateMany({
      where: { id: row.id, OR: [{ notifiedAt: null }, { notifiedAt: { lt: new Date(Date.now() - ALERT_EVERY_MS) } }] },
      data: { notifiedAt: new Date() },
    });
    if (!claimed.count || !emailConfigured()) return;

    const link = `${siteUrl}/en/admin/errors`;
    const text = [
      `Something went wrong on ${site.name}.`,
      "",
      `Where: ${source}${path ? ` (${path})` : ""}`,
      `What: ${message}`,
      `Times so far: ${row.count}`,
      "",
      `Details: ${link}`,
    ].join("\n");
    await sendEmail({
      to: ownerEmail(site.email),
      subject: `[${source}] ${message.slice(0, 80)}`,
      text,
      html: `<pre style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(text)}</pre>`,
    }).catch((e) => console.error("Could not send the error alert", e));
  } catch (e) {
    // Reporting must never cause an error of its own.
    console.error("Could not record an error", e);
  }
}
