import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@brand/db";
import { sendPasswordResetEmail } from "@/lib/auth-email";

export const auth = betterAuth({
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
  user: {
    additionalFields: {
      // Set to ADMIN directly in the database for your own account.
      role: { type: "string", defaultValue: "USER", input: false },
    },
  },
  // nextCookies must be last so server actions can set session cookies.
  plugins: [nextCookies()],
});
