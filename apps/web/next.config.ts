import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The db package ships TypeScript source (including the generated Prisma
  // client), so Next must compile it.
  transpilePackages: ["@brand/db"],
  serverExternalPackages: ["pg"],
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
