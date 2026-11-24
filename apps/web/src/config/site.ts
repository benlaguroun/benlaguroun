// One place to define your brand. Edit this file first.
export const site = {
  name: "Ben Laguroun",
  email: "hello@example.com",
  founder: "Ben Laguroun",

  // Used in the legal pages. Check these match how you really run the business.
  legal: {
    country: "Morocco",
    refundDays: 14, // how long buyers have to ask for a refund on templates and courses
    updated: "2026-11-24", // change this date whenever you edit the legal text
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

/** Only the profiles that have a link set. */
export function activeSocial() {
  return site.social.filter((s) => s.href);
}
