import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The db package ships TypeScript source (including the generated Prisma
  // client), so Next must compile it.
  transpilePackages: ["@brand/db"],
  serverExternalPackages: ["pg"],
};

export default nextConfig;
