import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy. It tells the browser which addresses a page may load
// code, images and frames from, so an injected script cannot phone home.
//  - Next.js writes a few small inline scripts and styles itself, so those are allowed.
//  - Product images and lesson videos can come from any https address you paste in Admin.
//  - There is deliberately no form-action rule: checkout posts to this site and is then
//    redirected to Stripe or PayPal, and browsers would block that redirect.
// Not applied in `npm run dev`, where hot reload needs looser rules.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  // Nobody can put this site inside a frame (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isProd
    ? [
        // Browsers only honour HSTS over https, so it is harmless on localhost.
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "Content-Security-Policy", value: csp },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // The db package ships TypeScript source (including the generated Prisma
  // client), so Next must compile it.
  transpilePackages: ["@brand/db"],
  serverExternalPackages: ["pg"],
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
