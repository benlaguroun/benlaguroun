import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Everything below is SAMPLE content so the site looks alive on first run.
// Replace it with your real offers, prices, and case studies.
async function main() {
  // ---- Services ---------------------------------------------------------
  const services = [
    {
      slug: "launch-site",
      name: "Launch Site",
      tagline: "A fast, branded website live in two weeks.",
      description:
        "A complete marketing site built on Next.js with your brand, copy structure, SEO basics, and a contact flow that feeds your inbox. Ideal for founders who need to look credible and start collecting leads.",
      priceCents: 150000,
      features: ["Up to 5 pages", "Brand-matched design", "SEO and analytics setup", "2 revision rounds", "Hosting handover"],
      featured: true,
      position: 1,
    },
    {
      slug: "custom-platform",
      name: "Custom Platform",
      tagline: "Multi-user web apps with auth, payments and dashboards.",
      description:
        "For businesses that need more than a brochure: user accounts, role-based access, payments, admin tools and AI-powered features, designed and built end to end.",
      priceCents: null,
      features: ["Discovery and scoping", "Auth and roles", "Payments and billing", "Admin dashboard", "Deployment and monitoring"],
      featured: true,
      position: 2,
    },
    {
      slug: "ai-automation",
      name: "AI Automation Setup",
      tagline: "Put repetitive business work on autopilot.",
      description:
        "Workflow audits and AI agent automations for support, lead follow-up and reporting, wired into the tools you already use.",
      priceCents: 90000,
      features: ["Workflow audit", "2 automations built", "Team walkthrough", "30 days support"],
      featured: false,
      position: 3,
    },
  ];
  for (const s of services) {
    await prisma.product.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, type: "SERVICE" },
    });
  }

  // ---- Templates --------------------------------------------------------
  const templates = [
    {
      slug: "saas-starter-kit",
      name: "SaaS Starter Kit",
      tagline: "Auth, billing and a dashboard, ready to customize.",
      description:
        "A production-ready Turborepo starter with Next.js, Tailwind, better-auth, Prisma and PostgreSQL. Skip the first month of setup and start building your actual product.",
      priceCents: 7900,
      features: ["Next.js + TypeScript", "better-auth with roles", "Prisma + PostgreSQL", "Stripe-ready billing hooks", "Lifetime updates"],
      deliveryUrl: "https://example.com/replace-with-your-download-link",
      previewUrl: "https://example.com",
      featured: true,
      position: 1,
    },
    {
      slug: "agency-landing-template",
      name: "Agency Landing Template",
      tagline: "A conversion-focused landing page for service businesses.",
      description:
        "A polished landing page template with hero, services, proof, pricing and contact sections. Edit one config file and ship.",
      priceCents: 3900,
      features: ["Single config file", "Responsive and accessible", "Dark and light themes", "SEO metadata built in"],
      deliveryUrl: "https://example.com/replace-with-your-download-link",
      previewUrl: "https://example.com",
      featured: true,
      position: 2,
    },
    {
      slug: "business-plan-notion-pack",
      name: "Business Plan Pack",
      tagline: "Plan, price and launch an offer with proven worksheets.",
      description:
        "A set of worksheets and checklists covering offer design, pricing, outreach and a 90-day launch plan.",
      priceCents: 2900,
      features: ["Offer design worksheet", "Pricing calculator", "90-day launch checklist"],
      deliveryUrl: "https://example.com/replace-with-your-download-link",
      featured: false,
      position: 3,
    },
  ];
  for (const t of templates) {
    await prisma.product.upsert({
      where: { slug: t.slug },
      update: {},
      create: { ...t, type: "TEMPLATE" },
    });
  }

  // ---- Course -----------------------------------------------------------
  const courseSlug = "build-your-business-online";
  const existing = await prisma.product.findUnique({ where: { slug: courseSlug } });
  if (!existing) {
    await prisma.product.create({
      data: {
        slug: courseSlug,
        type: "COURSE",
        name: "Build Your Business Online",
        tagline: "From idea to first paying customers, step by step.",
        description:
          "A practical course on validating an offer, building your brand and website, and landing your first clients. Short lessons, real examples, and templates you can copy.",
        priceCents: 14900,
        features: ["12 focused lessons", "Worksheets and templates", "Lifetime access", "Progress tracking"],
        featured: true,
        position: 1,
        course: {
          create: {
            modules: {
              create: [
                {
                  title: "Start with a clear offer",
                  position: 1,
                  lessons: {
                    create: [
                      {
                        slug: "welcome",
                        title: "Welcome and how to use this course",
                        summary: "What you will build and how to get the most from each lesson.",
                        content:
                          "Welcome! This course is built around action. Each lesson ends with a small task. Do the task before moving on.\n\nBy the end you will have a defined offer, a brand, a simple website and a plan to reach your first customers.",
                        durationMin: 4,
                        isPreview: true,
                        position: 1,
                      },
                      {
                        slug: "pick-your-niche",
                        title: "Pick a niche people pay for",
                        summary: "Find a problem that is painful, specific and budgeted.",
                        content:
                          "A good niche has three traits: the problem is painful, the buyer is easy to find, and they already spend money on it.\n\nTask: write down three possible niches and score each one from 1 to 5 on those traits.",
                        durationMin: 12,
                        position: 2,
                      },
                      {
                        slug: "write-your-offer",
                        title: "Write your offer in one sentence",
                        summary: "A simple formula for a clear, sellable promise.",
                        content:
                          "Formula: I help [who] achieve [result] in [timeframe] without [pain].\n\nTask: write five versions and test them on three people.",
                        durationMin: 10,
                        position: 3,
                      },
                    ],
                  },
                },
                {
                  title: "Brand and website",
                  position: 2,
                  lessons: {
                    create: [
                      {
                        slug: "brand-basics",
                        title: "Brand basics: name, voice, look",
                        summary: "Make decisions once, then reuse them everywhere.",
                        content:
                          "Pick a name, two colors, one font pairing, and three words that describe your voice. Write them on a single page. That page is your brand kit.",
                        durationMin: 14,
                        position: 1,
                      },
                      {
                        slug: "launch-your-site",
                        title: "Launch a one-page site",
                        summary: "What goes on the page and what to leave off.",
                        content:
                          "Your first site needs: a headline with your offer, proof, three steps to work with you, pricing or a way to enquire, and a clear call to action.",
                        durationMin: 18,
                        position: 2,
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });
  }

  // ---- Portfolio --------------------------------------------------------
  const projects = [
    {
      slug: "school-management-platform",
      title: "School Management Platform",
      client: "Private school (sample)",
      summary: "Multi-role portal with attendance, parent access and an AI layer.",
      body:
        "A multi-tenant platform for a school: automated attendance, a parent portal, a social feed and AI-assisted reporting.\n\nReplace this sample text with your real case study: the problem, what you built, and the result.",
      tags: ["Next.js", "Turborepo", "PostgreSQL", "AI"],
      featured: true,
      position: 1,
    },
    {
      slug: "hospitality-suite",
      title: "Hospitality Management Suite",
      client: "Hospitality group (sample)",
      summary: "Bookings, staff and guest management for multi-property operators.",
      body: "Replace this sample text with your real case study.",
      tags: ["Multi-tenant", "TypeScript", "Prisma"],
      featured: true,
      position: 2,
    },
    {
      slug: "print-on-demand-store",
      title: "Character-Driven Print on Demand Store",
      client: "Own brand (sample)",
      summary: "A branded storefront with automated fulfilment.",
      body: "Replace this sample text with your real case study.",
      tags: ["E-commerce", "Stripe", "Next.js"],
      featured: false,
      position: 3,
    },
  ];
  for (const p of projects) {
    await prisma.project.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
