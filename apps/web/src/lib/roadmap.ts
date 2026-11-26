import { prisma } from "@brand/db";
import { site, activeSocial } from "@/config/site";
import { emailConfigured } from "@/lib/email";
import { hasCompany } from "@/lib/company";
import { agentConfigured } from "@/lib/agent";

// The plan from ROADMAP.md, as data. The Admin -> Roadmap page reads this.
//  - "auto" items are checked by the site itself, so they tick themselves.
//  - Items without `auto` are ticked by hand on the page (stored in RoadmapItem).
//  - `after` lists items that must be done first; until then the item shows "waiting".
// To add or change a step, edit this file. Keys must stay unique and never change
// once you have ticked them.

export type Kind = "setup" | "business" | "code";
export type Status = "done" | "action" | "waiting";

type Ctx = {
  publishedReal: number;
  publishedDemo: number;
  publishedTemplates: number;
  projects: number;
  testimonials: number;
  posts: number;
  subscribers: number;
  activeClients: number;
  paidOrders: number;
  agentTasks: number;
  agentSent: number;
};

type Def = {
  key: string;
  phase: string;
  title: string;
  why: string;
  kind: Kind;
  href?: string; // where in the admin to do it
  auto?: (c: Ctx) => { done: boolean; detail?: string };
  after?: string[];
};

const env = (name: string) => (process.env[name] ?? "").trim();
const isLocal = (url: string) => !url || /localhost|127\.0\.0\.1/.test(url);

export const phases = [
  { id: "p0", title: "Phase 0 · Make it real", blurb: "The basics that make the site look and work like a real business." },
  { id: "p1", title: "Phase 1 · First income from services", blurb: "Cash first: you can invoice by bank transfer before Stripe exists." },
  { id: "p2", title: "Phase 2 · Safe to take money", blurb: "The engineering that stops a bad change from costing you a sale or a customer's trust." },
  { id: "p3", title: "Phase 3 · Templates", blurb: "Small, sharp products built from your real work." },
  { id: "p4", title: "Phase 4 · Content and the email list", blurb: "Useful posts every week, and a list that buys first." },
  { id: "p5", title: "Phase 5 · The course", blurb: "Validate, pre-sell, then record." },
  { id: "p6", title: "Phase 6 · After the company exists", blurb: "Live payments and the steps that wait for your LLC." },
  { id: "p7", title: "Phase 7 · AI assistant", blurb: "An assistant that drafts replies and handles routine work, with you approving the decisions." },
  { id: "p8", title: "Phase 8 · Compound", blurb: "Reviews, affiliates, recurring income." },
] as const;

const demoSlugs = ["launch-site", "custom-platform", "ai-automation", "saas-starter-kit", "agency-landing-template", "business-plan-notion-pack"];

export const defs: Def[] = [
  // Phase 0
  { key: "build-ok", phase: "p0", kind: "setup", title: "Run db:generate, db:push, typecheck and build on your Mac", why: "Confirms the database and code match after the latest updates." },
  {
    key: "real-email", phase: "p0", kind: "setup", title: "Set your real contact email (config/site.ts)",
    why: "The legal pages, receipts and contact details all show it. It is still the example address in config/site.ts until you change it.",
    auto: () => ({ done: !!site.email && !/example\.(com|org)$/.test(site.email), detail: site.email }),
  },
  {
    key: "socials", phase: "p0", kind: "setup", title: "Add your LinkedIn (and Facebook) links",
    why: "Buyers check that you are a real person. Links with an empty address are hidden.",
    auto: () => {
      const n = activeSocial().length;
      return { done: n >= 2, detail: `${n} profile link${n === 1 ? "" : "s"} set` };
    },
  },
  {
    key: "email-sending", phase: "p0", kind: "setup", title: "Email sending works (Brevo API key and sender)",
    why: "Receipts, verification and password-reset emails need it.",
    auto: () => ({ done: emailConfigured() }),
  },
  {
    key: "secret", phase: "p0", kind: "setup", title: "A strong BETTER_AUTH_SECRET is set (32+ characters)",
    why: "It signs sessions and download links.",
    auto: () => ({ done: env("BETTER_AUTH_SECRET").length >= 32 }),
  },
  {
    key: "domain", phase: "p0", kind: "setup", title: "Real domain set in NEXT_PUBLIC_APP_URL and BETTER_AUTH_URL",
    why: "Links in emails and the sitemap need your real address, not localhost. Set both to the same https:// address, then rebuild: NEXT_PUBLIC_APP_URL is baked in at build time.",
    auto: () => {
      const app = env("NEXT_PUBLIC_APP_URL");
      const auth = env("BETTER_AUTH_URL");
      const origin = (u: string) => {
        try {
          return new URL(u).origin;
        } catch {
          return "";
        }
      };
      let problem = "";
      if (isLocal(app) || isLocal(auth)) problem = "Still pointing at localhost";
      else if (!origin(app) || !origin(auth)) problem = "One of the two is not a valid address";
      else if (!app.startsWith("https://") || !auth.startsWith("https://")) problem = "Use https:// for a live site";
      else if (origin(app) !== origin(auth)) problem = "The two values must be the same address";
      return { done: !problem, detail: problem ? `${problem} (NEXT_PUBLIC_APP_URL = ${app || "not set"})` : app };
    },
  },
  {
    key: "hide-demo", phase: "p0", kind: "business", title: "Hide or replace the demo products", href: "/admin/products",
    why: "Demo items with sample descriptions make the site look unfinished.",
    auto: (c) => ({ done: c.publishedDemo === 0, detail: c.publishedDemo ? `${c.publishedDemo} demo product${c.publishedDemo === 1 ? "" : "s"} still published` : undefined }),
  },
  {
    key: "real-product", phase: "p0", kind: "business", title: "Publish at least one real product or service", href: "/admin/products/new",
    why: "You need something real to sell, with a real description and price.",
    auto: (c) => ({ done: c.publishedReal >= 1, detail: `${c.publishedReal} real published` }),
  },
  { key: "headline", phase: "p0", kind: "business", title: "Rewrite the homepage headline for one audience", why: "One sentence saying who you help and how. Narrow beats broad." },
  { key: "llc-started", phase: "p0", kind: "business", title: "Start the LLC paperwork", why: "Stripe and PayPal accounts, the bank account and the legal pages all depend on it." },
  { key: "llc-filled", phase: "p0", kind: "setup", title: "Fill in the company block in config/site.ts", after: ["llc-started"], why: "Once the company exists, the legal pages, footer and emails switch to its name by themselves.", auto: () => ({ done: hasCompany, detail: hasCompany ? site.company.legalName : undefined }) },

  // Phase 1
  { key: "packages", phase: "p1", kind: "business", title: "Write the service packages and the care plan", href: "/admin/products", why: "Fixed scope, price, timeline and deposit for each. Packages sell better than hourly work. Written in SERVICES.md; load them with npm run db:services, then adjust prices in Products." },
  { key: "booking", phase: "p1", kind: "code", title: "Add a booking link (Calendly or Cal.com) to services and contact",
    why: "Many serious clients prefer picking a time over filling a form. Paste your link into site.booking.url in config/site.ts.",
    auto: () => {
      const url = site.booking.url;
      return { done: /^https:\/\//.test(url), detail: url ? "Link set" : "No link yet" };
    },
  },
  {
    key: "portfolio", phase: "p1", kind: "business", title: "Show 3 real projects with results", href: "/admin/projects",
    why: "Proof beats promises. Say the problem, what you built and the result.",
    auto: (c) => ({ done: c.projects >= 3, detail: `${c.projects} of 3` }),
  },
  { key: "outreach", phase: "p1", kind: "business", title: "Contact 20 people directly (aim for 3 calls, 1 client)", why: "Your fastest route to the first paid project." },
  {
    key: "first-client", phase: "p1", kind: "business", title: "Sign your first paying client", href: "/admin/clients",
    why: "Mark the client as Active in Admin → Clients.",
    auto: (c) => ({ done: c.activeClients >= 1, detail: `${c.activeClients} active` }),
  },
  {
    key: "testimonials", phase: "p1", kind: "business", title: "Collect 3 testimonials", href: "/admin/testimonials",
    why: "A short video from one client beats ten text quotes.",
    auto: (c) => ({ done: c.testimonials >= 3, detail: `${c.testimonials} of 3 published` }),
  },

  // Phase 2
  { key: "tests", phase: "p2", kind: "code", title: "Automated tests for checkout, webhooks, refunds and downloads, run by CI on every push", why: "Your biggest technical risk: one bad edit could silently stop receipts or leak a paid file." },
  { key: "headers", phase: "p2", kind: "code", title: "Security headers (CSP, frame, referrer, HSTS)", why: "Cheap to add, and some buyers' scanners look for them." },
  { key: "deploy", phase: "p2", kind: "code", title: "Dockerfile and compose file, with a one-command deploy", why: "So a deploy is a script, not steps in your head." },
  { key: "backups", phase: "p2", kind: "setup", title: "Nightly backups of the database and uploads (including uploads/private), with a tested restore", why: "If the disk dies, the paid files and the customer list die with it." },
  { key: "live-check", phase: "p2", kind: "setup", title: "Open Admin → Live check and fix everything marked Problem", href: "/admin/health", after: ["domain"], why: "The site tests its own public address, the database, email and payments, and tells you the fix for each problem. Run it after every deploy." },
  { key: "uptime", phase: "p2", kind: "setup", title: "Add a free uptime monitor on /api/health", why: "UptimeRobot or Better Stack can email you within minutes if the site or tunnel goes down, so you hear about it before a customer does." },
  { key: "video", phase: "p2", kind: "code", title: "Protected course video (domain-restricted host)", why: "An unlisted YouTube link can be copied and shared by any buyer." },
  { key: "tax", phase: "p2", kind: "business", title: "Ask an accountant about sales tax / VAT, then add it to checkout if needed", after: ["llc-started"], why: "The legal text says tax is added where required; checkout does not compute it yet." },

  // Phase 3
  {
    key: "first-template", phase: "p3", kind: "business", title: "Publish your first real template", href: "/admin/products/new",
    why: "Package a piece of work you have already done, with a live demo, a video and docs.",
    auto: (c) => ({ done: c.publishedTemplates >= 1, detail: `${c.publishedTemplates} published` }),
  },
  { key: "free-template", phase: "p3", kind: "business", title: "Add a free template behind the newsletter signup", why: "Gives people a reason to join your list." },
  { key: "og-images", phase: "p3", kind: "code", title: "Open Graph preview images for products and posts", why: "Shares on LinkedIn and WhatsApp look bare without them." },
  { key: "coupons", phase: "p3", kind: "code", title: "Coupons and bundles", why: "Needed for a launch discount and for selling templates as a pack." },
  { key: "template-launch", phase: "p3", kind: "business", title: "Launch the first template to your list and three communities", why: "Write about how you built it rather than just advertising it." },

  // Phase 4
  {
    key: "posts", phase: "p4", kind: "business", title: "Publish your first 4 posts", href: "/admin/posts/new",
    why: "One useful post a week, aimed at your audience, each linking to a template or service.",
    auto: (c) => ({ done: c.posts >= 4, detail: `${c.posts} of 4 published` }),
  },
  {
    key: "list", phase: "p4", kind: "business", title: "Reach 25 newsletter subscribers", href: "/admin/subscribers",
    why: "The email list is the asset that does not depend on any platform.",
    auto: (c) => ({ done: c.subscribers >= 25, detail: `${c.subscribers} of 25` }),
  },

  // Phase 5
  { key: "course-validate", phase: "p5", kind: "business", title: "Validate the course with a free workshop or mini-course", why: "If a few dozen people attend and ask for more, build it." },
  { key: "course-presell", phase: "p5", kind: "business", title: "Pre-sell a founders' first cohort", after: ["course-validate"], why: "Paid feedback, and money before months of recording." },
  { key: "course-record", phase: "p5", kind: "business", title: "Record and publish the lessons in modules", after: ["course-presell"], why: "Use the early students' progress to fix the weak lessons." },
  { key: "certificate", phase: "p5", kind: "code", title: "Course certificate and a private community group", why: "A free marketing tool: students share certificates." },

  // Phase 6
  {
    key: "stripe-live", phase: "p6", kind: "setup", title: "Stripe live keys and webhook configured", after: ["llc-filled"],
    why: "Create the Stripe account under the company, then set STRIPE_SECRET_KEY (sk_live_…) and STRIPE_WEBHOOK_SECRET.",
    auto: () => ({ done: env("STRIPE_SECRET_KEY").startsWith("sk_live_") && !!env("STRIPE_WEBHOOK_SECRET") }),
  },
  {
    key: "paypal-live", phase: "p6", kind: "setup", title: "PayPal live app and webhook configured", after: ["llc-filled"],
    why: "Set PAYPAL_ENV=live, the live client ID and secret, and PAYPAL_WEBHOOK_ID.",
    auto: () => ({ done: env("PAYPAL_ENV") === "live" && !!env("PAYPAL_WEBHOOK_ID") }),
  },
  { key: "lawyer", phase: "p6", kind: "business", title: "Have a lawyer read the legal pages", why: "The text is a solid start, not legal advice." },
  { key: "real-purchase", phase: "p6", kind: "setup", title: "Make one real purchase with your own card, then refund it", after: ["stripe-live"], why: "Check the receipt and download, and that a refund removes access." },
  {
    key: "first-sale", phase: "p6", kind: "business", title: "First paid order", href: "/admin/payments",
    why: "The moment the platform pays for itself.",
    auto: (c) => ({ done: c.paidOrders >= 1, detail: `${c.paidOrders} paid` }),
  },

  // Phase 7: the assistant, in the order I recommend building it
  {
    key: "ai-key", phase: "p7", kind: "setup", title: "Add an AI key so Ben can think (Claude, OpenAI or Groq)", href: "/admin/assistant",
    why: "Put ANTHROPIC_API_KEY, OPENAI_API_KEY and/or GROQ_API_KEY in your environment, restart, then switch Ben on in Admin → Assistant.",
    auto: () => ({ done: agentConfigured() }),
  },
  {
    key: "ai-decisions", phase: "p7", kind: "code", title: "Activity log and approval queue", href: "/admin/assistant",
    why: "Built: every action Ben takes is recorded, and nothing is sent until you press Approve. This ticks once Ben has handled his first message.",
    auto: (c) => ({ done: c.agentTasks >= 1, detail: `${c.agentTasks} task${c.agentTasks === 1 ? "" : "s"} logged` }),
  },
  { key: "ai-triage", phase: "p7", kind: "code", title: "Triage: Ben labels each new message", after: ["ai-key"], why: "Built, together with the draft reply. Each message gets a category, urgency, language, summary and a confidence score.", auto: (c) => ({ done: c.agentTasks >= 1 }) },
  {
    key: "ai-drafts", phase: "p7", kind: "code", title: "Drafted replies that you approve before sending", href: "/admin/assistant", after: ["ai-key"],
    why: "Built. This ticks after you approve and send your first reply from Ben.",
    auto: (c) => ({ done: c.agentSent >= 1, detail: `${c.agentSent} sent` }),
  },
  { key: "ai-followups", phase: "p7", kind: "code", title: "Follow-up reminders for leads you have not answered", after: ["ai-drafts"], why: "Fast replies and follow-ups win most small sales." },
  { key: "ai-digest", phase: "p7", kind: "code", title: "Daily digest: what happened and what needs you", after: ["ai-decisions"], why: "One short summary instead of checking five pages." },
  { key: "ai-auto", phase: "p7", kind: "code", title: "Let the assistant send by itself for a category once its drafts are almost always approved unchanged", after: ["ai-drafts"], why: "Graduate one category at a time. Refunds, quotes, contracts and pricing never go automatic." },

  // Phase 8
  { key: "reviews", phase: "p8", kind: "code", title: "Verified-buyer reviews on product pages", why: "Social proof from real purchases." },
  { key: "affiliates", phase: "p8", kind: "code", title: "Affiliate links with commission tracking", why: "Lets people with audiences promote you." },
  { key: "care-plan", phase: "p8", kind: "business", title: "First monthly care-plan client", after: ["first-client"], why: "Steady recurring income that makes the business calm." },
];

export type Item = Omit<Def, "auto" | "after"> & { status: Status; detail?: string; auto: boolean; waitingFor?: string };

export async function loadRoadmap() {
  const demo = { slug: { in: demoSlugs } };
  const [publishedReal, publishedDemo, publishedTemplates, projects, testimonials, posts, subscribers, activeClients, paidOrders, agentTasks, agentSent] =
    await Promise.all([
      prisma.product.count({ where: { published: true, NOT: demo } }),
      prisma.product.count({ where: { published: true, ...demo } }),
      prisma.product.count({ where: { published: true, type: "TEMPLATE", NOT: demo } }),
      prisma.project.count(),
      prisma.testimonial.count({ where: { published: true } }),
      prisma.post.count({ where: { published: true } }),
      prisma.subscriber.count(),
      prisma.client.count({ where: { status: "ACTIVE" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      // The assistant's table appears after db:push; until then count it as zero.
      prisma.agentTask.count().catch(() => 0),
      prisma.agentTask.count({ where: { status: "SENT" } }).catch(() => 0),
    ]);
  const ctx: Ctx = { publishedReal, publishedDemo, publishedTemplates, projects, testimonials, posts, subscribers, activeClients, paidOrders, agentTasks, agentSent };

  // The hand-ticked items live in the database. If the table isn't there yet,
  // the page still works and tells you to run db:push.
  let manual = new Map<string, boolean>();
  let needsPush = false;
  try {
    manual = new Map((await prisma.roadmapItem.findMany()).map((r: { key: string; done: boolean }) => [r.key, r.done]));
  } catch {
    needsPush = true;
  }

  const done = new Map<string, boolean>();
  const detail = new Map<string, string | undefined>();
  for (const d of defs) {
    if (d.auto) {
      const r = d.auto(ctx);
      done.set(d.key, r.done);
      detail.set(d.key, r.detail);
    } else done.set(d.key, manual.get(d.key) === true);
  }

  const title = new Map(defs.map((d) => [d.key, d.title]));
  const items: Item[] = defs.map(({ auto, after, ...d }) => {
    const isDone = done.get(d.key) === true;
    const blocker = after?.find((k) => done.get(k) !== true);
    const status: Status = isDone ? "done" : blocker ? "waiting" : "action";
    return { ...d, status, detail: detail.get(d.key), auto: !!auto, waitingFor: blocker ? title.get(blocker) : undefined };
  });

  return { items, needsPush };
}

export const roadmapKeys = new Set(defs.filter((d) => !d.auto).map((d) => d.key));
