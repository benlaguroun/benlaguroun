// One place to define your brand. Edit this file first.
export const site = {
  name: "Ben Laguroun",
  email: "hello@example.com",
  founder: "Ben Laguroun",
  social: [
    { label: "GitHub", href: "https://github.com/benlaguroun" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
  // Technologies shown in the scrolling strip on the homepage.
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
    { key: "contact", href: "/contact" },
  ],
} as const;
