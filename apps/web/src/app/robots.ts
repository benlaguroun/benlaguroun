import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private or useless-in-search areas, in every language.
        disallow: [
          "/api/",
          "/*/admin",
          "/*/dashboard",
          "/*/learn/",
          "/*/checkout",
          "/*/login",
          "/*/signup",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
