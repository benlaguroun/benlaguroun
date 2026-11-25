import { access, constants } from "node:fs/promises";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { emailConfigured } from "@/lib/email";
import { agentConfigured, getAgentConfig } from "@/lib/agent";
import { siteUrl } from "@/lib/site-url";
import { uploadDir } from "@/lib/uploads";

// The checks behind Admin -> Live check. They run on the server, so the site tests its own
// public address the way a visitor would: out through Cloudflare and back through the tunnel.
// A check never throws: a problem becomes a "fail" or "warn" with a plain explanation.

export type CheckStatus = "ok" | "warn" | "fail";
export type Check = { id: string; group: string; label: string; status: CheckStatus; detail: string; fix?: string };

const env = (name: string) => (process.env[name] ?? "").trim();
const isLocal = (url: string) => !url || /localhost|127\.0\.0\.1/.test(url);
const FREE_MAIL = /@(gmail|googlemail|yahoo|hotmail|outlook|live|icloud|aol)\./i;

async function fetchPage(url: string, ms = 8000) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(ms),
      headers: { "user-agent": "live-check (benlaguroun admin)" },
    });
    return { res, ms: Date.now() - started, error: null as string | null };
  } catch (e) {
    const timeout = e instanceof Error && /timeout|abort/i.test(e.name + e.message);
    return { res: null, ms: Date.now() - started, error: timeout ? `No answer after ${ms / 1000} seconds` : "Could not connect" };
  }
}

function originOf(u: string) {
  try {
    return new URL(u).origin;
  } catch {
    return "";
  }
}

async function guard(base: Omit<Check, "status" | "detail">, run: () => Promise<Pick<Check, "status" | "detail" | "fix">>): Promise<Check> {
  try {
    return { ...base, ...(await run()) };
  } catch {
    return { ...base, status: "fail", detail: "This check crashed. See the server log." };
  }
}

export async function runLiveChecks(): Promise<Check[]> {
  const app = env("NEXT_PUBLIC_APP_URL");
  const auth = env("BETTER_AUTH_URL");
  const host = (() => {
    try {
      return new URL(siteUrl).hostname;
    } catch {
      return "";
    }
  })();
  const local = isLocal(siteUrl);

  const checks = await Promise.all([
    // Address
    guard({ id: "address", group: "Address", label: "Site address is set up" }, async () => {
      if (isLocal(app) || isLocal(auth)) {
        return { status: "fail", detail: `Still pointing at localhost (${app || "not set"}).`, fix: "Set NEXT_PUBLIC_APP_URL and BETTER_AUTH_URL to your https:// address in apps/web/.env.production.local, then run ./deploy/deploy.sh." };
      }
      if (!app.startsWith("https://") || !auth.startsWith("https://")) return { status: "fail", detail: "A live site must use https://.", fix: "Change both values to start with https://, then redeploy." };
      if (originOf(app) !== originOf(auth)) return { status: "fail", detail: "NEXT_PUBLIC_APP_URL and BETTER_AUTH_URL are different addresses.", fix: "Make both exactly the same, then redeploy." };
      return { status: "ok", detail: originOf(app) };
    }),

    // Reachability
    guard({ id: "home", group: "Reachability", label: "Public site answers" }, async () => {
      const r = await fetchPage(`${siteUrl}/en`);
      if (!r.res) {
        return { status: "fail", detail: `${r.error} at ${siteUrl}.`, fix: "Check the tunnel (cloudflared) is running and the DNS route exists, then that the site is running (pm2 list)." };
      }
      if (r.res.status === 530 || r.res.status === 1033) return { status: "fail", detail: `Cloudflare error ${r.res.status}: the tunnel is not connected.`, fix: "Start the tunnel: cloudflared tunnel --edge-ip-version 4 run brand (or restart its service)." };
      if (r.res.status === 502 || r.res.status === 503 || r.res.status === 504) return { status: "fail", detail: `Error ${r.res.status}: Cloudflare cannot reach the site on your machine.`, fix: "Check the site is running: pm2 list, then pm2 logs brand-web." };
      if (!r.res.ok) return { status: "fail", detail: `The home page answered with error ${r.res.status}.`, fix: "Look at pm2 logs brand-web and Admin → Errors." };
      return { status: r.ms > 3000 ? "warn" : "ok", detail: `200 OK in ${r.ms} ms`, fix: r.ms > 3000 ? "Slow. The first visit after a restart can be slow; check again." : undefined };
    }),
    guard({ id: "seo", group: "Reachability", label: "robots.txt and sitemap use your domain" }, async () => {
      const [robots, sitemap] = await Promise.all([fetchPage(`${siteUrl}/robots.txt`), fetchPage(`${siteUrl}/sitemap.xml`)]);
      if (!robots.res || !sitemap.res) return { status: "fail", detail: "Could not load robots.txt or sitemap.xml from the public address." };
      if (!robots.res.ok || !sitemap.res.ok) return { status: "fail", detail: `robots.txt answered ${robots.res.status}, sitemap.xml answered ${sitemap.res.status}.` };
      const [rt, st] = await Promise.all([robots.res.text(), sitemap.res.text()]);
      if (/localhost|127\.0\.0\.1/.test(rt + st)) return { status: "fail", detail: "They still contain localhost addresses.", fix: "The address was not set when the site was built. Fix the .env.production.local values and run ./deploy/deploy.sh." };
      if (!local && !st.includes(originOf(siteUrl))) return { status: "warn", detail: "The sitemap does not list your domain." };
      return { status: "ok", detail: "Both point at your domain." };
    }),
    guard({ id: "www", group: "Reachability", label: "www address works" }, async () => {
      if (local || !host) return { status: "warn", detail: "Skipped (running on localhost)." };
      const other = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
      const r = await fetchPage(`https://${other}/en`);
      if (!r.res) return { status: "warn", detail: `https://${other} does not answer.`, fix: `Run: cloudflared tunnel route dns brand ${other}  (and add it to ~/.cloudflared/config.yml).` };
      return { status: r.res.ok ? "ok" : "warn", detail: `https://${other} answers ${r.res.status}${new URL(r.res.url).hostname !== other ? ` and redirects to ${new URL(r.res.url).hostname}` : ""}.` };
    }),

    // Server
    guard({ id: "env", group: "Server", label: "Running in production mode" }, async () => ({
      status: process.env.NODE_ENV === "production" ? "ok" : "warn",
      detail: process.env.NODE_ENV === "production" ? "NODE_ENV is production." : `NODE_ENV is ${process.env.NODE_ENV}. That is normal on your laptop, not on the live site.`,
    })),
    guard({ id: "db", group: "Server", label: "Database answers" }, async () => {
      const t = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const ms = Date.now() - t;
      return { status: ms > 1000 ? "warn" : "ok", detail: `Answered in ${ms} ms.` };
    }),
    guard({ id: "uploads", group: "Server", label: "Uploads folder is writable" }, async () => {
      const dir = uploadDir();
      try {
        await access(dir, constants.W_OK);
        return { status: "ok", detail: `${dir} (paid template files go in its private folder). Include it in your backups.` };
      } catch {
        return { status: "warn", detail: `${dir} does not exist yet or is not writable.`, fix: "It is created on the first upload. If uploads fail, create the folder or set UPLOAD_DIR to one that exists." };
      }
    }),
    guard({ id: "secret", group: "Server", label: "Login secret is strong" }, async () => {
      const ok = env("BETTER_AUTH_SECRET").length >= 32;
      return { status: ok ? "ok" : "fail", detail: ok ? "BETTER_AUTH_SECRET is set (32+ characters)." : "BETTER_AUTH_SECRET is missing or shorter than 32 characters.", fix: ok ? undefined : "Create one with: openssl rand -base64 32" };
    }),
    guard({ id: "errors", group: "Server", label: "No open errors" }, async () => {
      const open = await prisma.errorLog.count({ where: { resolved: false } });
      return open === 0 ? { status: "ok", detail: "Nothing in Admin → Errors." } : { status: "warn", detail: `${open} open error${open === 1 ? "" : "s"}.`, fix: "Open Admin → Errors, fix or mark them resolved." };
    }),
    guard({ id: "demo", group: "Server", label: "Demo products hidden" }, async () => {
      const demo = await prisma.product.count({
        where: { published: true, slug: { in: ["launch-site", "custom-platform", "ai-automation", "saas-starter-kit", "agency-landing-template", "business-plan-notion-pack"] } },
      });
      return demo === 0 ? { status: "ok", detail: "No demo products are published." } : { status: "warn", detail: `${demo} demo product${demo === 1 ? " is" : "s are"} still published.`, fix: "Hide or replace them in Admin → Products before sharing the site." };
    }),

    // Email
    guard({ id: "email", group: "Email", label: "Email sending is set up" }, async () => {
      if (!emailConfigured()) return { status: "fail", detail: "BREVO_API_KEY or EMAIL_FROM is missing, so receipts and verification emails are not sent.", fix: "Set both in the environment and redeploy." };
      const from = env("EMAIL_FROM").toLowerCase();
      if (FREE_MAIL.test(from)) return { status: "warn", detail: `Sending from ${from}. Mail from a free address often lands in spam.`, fix: "Verify your domain in Brevo (SPF and DKIM in Cloudflare DNS) and use hello@" + (host || "yourdomain.com") + "." };
      if (host && !from.endsWith(`@${host.replace(/^www\./, "")}`)) return { status: "warn", detail: `Sending from ${from}, which is not on your domain.` };
      return { status: "ok", detail: `Sending from ${from}.` };
    }),
    guard({ id: "contact", group: "Email", label: "Contact email is real" }, async () => {
      const ok = !!site.email && !/example\.(com|org)$/.test(site.email);
      return { status: ok ? "ok" : "fail", detail: ok ? site.email : "config/site.ts still has the example address.", fix: ok ? undefined : "Put your real address in config/site.ts and redeploy." };
    }),

    // Payments
    guard({ id: "stripe", group: "Payments", label: "Stripe" }, async () => {
      const key = env("STRIPE_SECRET_KEY");
      if (!key) return { status: "warn", detail: "Not set up yet. Fine until your company exists." };
      if (!env("STRIPE_WEBHOOK_SECRET")) return { status: "fail", detail: "A key is set but STRIPE_WEBHOOK_SECRET is missing, so paid orders would never be confirmed.", fix: "Create the webhook to https://" + (host || "yourdomain.com") + "/api/webhooks/stripe and set its signing secret." };
      return key.startsWith("sk_live_") ? { status: "ok", detail: "Live mode, webhook secret set." } : { status: "warn", detail: "Test mode: no real money moves. Switch to live keys when you are ready." };
    }),
    guard({ id: "paypal", group: "Payments", label: "PayPal" }, async () => {
      if (!env("PAYPAL_CLIENT_ID")) return { status: "warn", detail: "Not set up yet. Fine until your company exists." };
      if (!env("PAYPAL_WEBHOOK_ID")) return { status: "fail", detail: "A client ID is set but PAYPAL_WEBHOOK_ID is missing.", fix: "Create the webhook to https://" + (host || "yourdomain.com") + "/api/webhooks/paypal and set its ID." };
      return env("PAYPAL_ENV") === "live" ? { status: "ok", detail: "Live mode, webhook set." } : { status: "warn", detail: "Sandbox mode: no real money moves." };
    }),

    // Assistant
    guard({ id: "assistant", group: "Assistant", label: "Ben (AI assistant)" }, async () => {
      const config = await getAgentConfig();
      if (config.enabled && !agentConfigured()) return { status: "fail", detail: "Ben is on but no AI key is set, so he cannot draft anything.", fix: "Add ANTHROPIC_API_KEY, OPENAI_API_KEY or GROQ_API_KEY and redeploy." };
      if (!config.enabled) return { status: "warn", detail: "Ben is switched off." };
      return { status: "ok", detail: "On, with an AI key set." };
    }),
  ]);
  return checks;
}
