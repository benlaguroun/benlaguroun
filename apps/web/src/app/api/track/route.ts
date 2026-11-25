import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@brand/db";
import { isLocale } from "@/i18n/config";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

// Private or technical areas that should never show up in the statistics.
const IGNORED = ["/admin", "/dashboard", "/learn", "/login", "/signup", "/forgot-password", "/reset-password", "/unsubscribe"];
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|monitor|uptime|curl|wget|python|axios|node-fetch|go-http|java\//i;

const ok = () => new Response(null, { status: 204 });

function deviceOf(ua: string) {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

/** The site a visit came from, or null for direct visits and our own pages. */
function referrerHost(raw: unknown, ownHosts: string[]) {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    return ownHosts.includes(host) ? null : host.slice(0, 100);
  } catch {
    return null;
  }
}

/**
 * Records one page view. It stores the page, language, the referring site,
 * country, device type and a hash that changes every day. It never stores the
 * IP address or sets a cookie, and it always answers 204 so it can't be probed.
 */
export async function POST(req: NextRequest) {
  try {
    if (req.cookies.get("no_track")) return ok(); // set when you visit the admin

    const ua = req.headers.get("user-agent") ?? "";
    if (!ua || BOT.test(ua)) return ok();

    const ip = await clientIp();
    if (rateLimited(`track:${ip}`, 120, 60_000)) return ok();

    let body: { path?: unknown; referrer?: unknown };
    try {
      body = JSON.parse(await req.text());
    } catch {
      return ok();
    }
    if (typeof body.path !== "string" || body.path.length > 300 || !body.path.startsWith("/")) return ok();

    // "/fr/services/launch-site" -> locale "fr", path "/services/launch-site"
    const [, first, ...rest] = body.path.split("?")[0]!.split("#")[0]!.split("/");
    if (!isLocale(first)) return ok();
    const path = ("/" + rest.join("/")).replace(/\/+$/, "") || "/";
    if (IGNORED.some((p) => path === p || path.startsWith(`${p}/`))) return ok();

    const ownHosts = [new URL(siteUrl).hostname.replace(/^www\./, ""), (req.headers.get("host") ?? "").split(":")[0]!.replace(/^www\./, "")];
    const day = new Date().toISOString().slice(0, 10);
    const secret = process.env.BETTER_AUTH_SECRET ?? "";
    const visitor = createHash("sha256").update(`${day}|${ip}|${ua}|${secret}`).digest("hex").slice(0, 16);
    const country = req.headers.get("cf-ipcountry");

    await prisma.pageView.create({
      data: {
        path: path.slice(0, 200),
        locale: first,
        referrer: referrerHost(body.referrer, ownHosts),
        country: country && /^[A-Z]{2}$/.test(country) ? country : null,
        device: deviceOf(ua),
        visitor,
      },
    });

    // Housekeeping: now and then, drop views older than about 13 months.
    if (Math.random() < 0.01) {
      void prisma.pageView
        .deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 400 * 86_400_000) } } })
        .catch(() => undefined);
    }
  } catch (err) {
    console.error("Could not record a page view", err);
  }
  return ok();
}
