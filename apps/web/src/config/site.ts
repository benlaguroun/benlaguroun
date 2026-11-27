// One place to define your brand. Edit this file first.
export const site = {
  name: "Ben Laguroun",
  email: "hello@example.com",
  founder: "Ben Laguroun",

  // Your company, once it exists. Leave legalName empty to trade under your own
  // name for now: the legal pages, footer, receipts and newsletter then use the
  // brand name and your country below. When the LLC is registered, fill these in
  // and everything updates by itself (and bump `legal.updated`).
  company: {
    legalName: "", // exactly as registered, e.g. "Laguroun Digital LLC"
    entityType: "LLC", // shown as "a {entityType} registered in {jurisdiction}"
    jurisdiction: "", // where it is registered, e.g. "Wyoming, United States"
    registrationNumber: "", // the number on your certificate of formation
    address: "", // registered address, shown on the legal pages and in emails
    taxNumber: "", // VAT / EIN, only if you want it shown
    governingLaw: "", // empty = same as jurisdiction, e.g. "the State of Wyoming, United States"
  },

  // Used in the legal pages. Check these match how you really run the business.
  legal: {
    country: "Morocco", // where you work from, used until a company jurisdiction is set
    refundDays: 14, // how long buyers have to ask for a refund on templates and courses
    updated: "2026-11-25", // change this date whenever you edit the legal text
  },

  // The shop (templates and courses). Keep it closed until your company and payments
  // are ready: while closed, the menu, footer, home page, sitemap and dashboard hide
  // templates and courses and their pages return "not found". Services, the portfolio,
  // the blog and the contact page stay live. Set open to true when you can take payments.
  shop: {
    open: false as boolean,
  },

  // Booking page (Cal.com or Calendly). Paste your full link to show a "Book a free
  // call" button on every service page and on the contact page. Empty = hidden.
  booking: {
    url: "" as string, // e.g. https://cal.com/your-handle/30min
  },

  // Social profiles. Links with an empty href are hidden automatically, so
  // paste your full profile URLs here to switch them on everywhere
  // (hero, About page and footer).
  social: [
    { key: "github", label: "GitHub", href: "https://github.com/benlaguroun" },
    { key: "linkedin", label: "LinkedIn", href: "" }, // e.g. https://www.linkedin.com/in/your-handle
    { key: "facebook", label: "Facebook", href: "" }, // e.g. https://www.facebook.com/your.page
  ],

  // Technologies shown in the scrolling strip and on the About page.
  stack: [
    "Turborepo",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "better-auth",
    "Prisma",
    "PostgreSQL",
    "AI agents",
    "Multi-tenant",
    "Self-hosted",
  ],
  nav: [
    { key: "services", href: "/services" },
    { key: "templates", href: "/templates" },
    { key: "courses", href: "/courses" },
    { key: "work", href: "/portfolio" },
    { key: "blog", href: "/blog" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ],
} as const;

export type SocialKey = (typeof site.social)[number]["key"];

/** Menu links, without the shop pages while the shop is closed. */
export function navItems() {
  return site.nav.filter((n) => site.shop.open || (n.key !== "templates" && n.key !== "courses"));
}

/** Only the profiles that have a link set. */
export function activeSocial() {
  return site.social.filter((s) => s.href);
}
