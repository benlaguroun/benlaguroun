// One place to define your brand. Edit this file first.
export const site = {
  name: "Your Brand",
  tagline: "Websites, templates and courses to help your business grow.",
  description:
    "Custom web platforms, ready-made templates and practical business courses from an independent developer and builder.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  email: "hello@example.com",
  founder: "Your Name",
  social: [
    { label: "GitHub", href: "https://github.com/benlaguroun" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
  nav: [
    { label: "Services", href: "/services" },
    { label: "Templates", href: "/templates" },
    { label: "Courses", href: "/courses" },
    { label: "Work", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
