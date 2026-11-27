import type { MetadataRoute } from "next";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { absoluteUrl, languageAlternates, pathFor } from "@/lib/seo";

// Built from the database, so new products and projects appear automatically.
export const dynamic = "force-dynamic";

const staticPages = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/templates", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/portfolio", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/refunds", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, projects, posts] = await Promise.all([
    prisma.product.findMany({ where: { published: true }, select: { slug: true, type: true, updatedAt: true } }),
    prisma.project.findMany({ select: { slug: true, createdAt: true } }),
    prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const section = { SERVICE: "/services", TEMPLATE: "/templates", COURSE: "/courses" } as const;

  const shopPaths = ["/courses", "/templates"];
  const live = (path: string) => site.shop.open || !shopPaths.some((s) => path === s || path.startsWith(`${s}/`));

  const pages = [
    ...staticPages.map((p) => ({ ...p, lastModified: undefined as Date | undefined })),
    ...products.map((p) => ({
      path: `${section[p.type]}/${p.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: p.updatedAt as Date | undefined,
    })),
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: p.updatedAt as Date | undefined,
    })),
    ...projects.map((p) => ({
      path: `/portfolio/${p.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: p.createdAt as Date | undefined,
    })),
  ];

  // One entry per language, each pointing at its translations.
  return pages.filter((page) => live(page.path)).flatMap((page) =>
    locales.map((locale) => ({
      url: absoluteUrl(pathFor(locale, page.path)),
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(page.path))
            .filter(([k]) => k !== "x-default")
            .map(([k, v]) => [k, absoluteUrl(v)]),
        ),
      },
    })),
  );
}
