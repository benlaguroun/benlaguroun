import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@brand/db";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/auth-email";

/**
 * Addresses the login system accepts requests from: your real domain, plus its
 * "www." twin (or the bare domain if you use www), so signing in works on both.
 * Set BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL to your domain, e.g. https://example.com.
 */
function trustedOrigins() {
  const origins = new Set<string>();
  for (const raw of [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL]) {
    if (!raw) continue;
    try {
      const url = new URL(raw);
      origins.add(url.origin);
      const host = url.hostname;
      if (host === "localhost" || /^[\d.]+$/.test(host) || host.includes(":")) continue; // no twin for localhost or an IP
      const twin = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
      origins.add(`${url.protocol}//${twin}${url.port ? `:${url.port}` : ""}`);
    } catch {
      // A malformed value is reported by the roadmap check; ignore it here.
    }
  }
  return [...origins];
}

export const auth = betterAuth({
  trustedOrigins: trustedOrigins(),
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // The link works for one hour. Changing the password signs the account out
    // everywhere, which is what you want if someone else had access.
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    // Not awaited on purpose: waiting for the email would make the answer slower
    // when the address exists, which would reveal who has an account.
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail(user, url);
    },
  },
  emailVerification: {
    // Sent when someone signs up, and again from the "send it again" button.
    // Signing in is never blocked: only buying needs a confirmed address (see lib/verification.ts).
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail(user, url);
    },
  },
  user: {
    additionalFields: {
      // Set to ADMIN directly in the database for your own account.
      role: { type: "string", defaultValue: "USER", input: false },
    },
  },
  // nextCookies must be last so server actions can set session cookies.
  plugins: [nextCookies()],
});
