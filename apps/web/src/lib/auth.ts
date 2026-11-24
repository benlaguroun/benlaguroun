import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@brand/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
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
