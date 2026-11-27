import path from "node:path";
import { defineConfig } from "vitest/config";

// Tests run without a database: every test that touches Prisma replaces it with a
// small fake, so `npm test` works on any machine and in CI.
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: { BETTER_AUTH_SECRET: "test-secret-that-is-long-enough-for-signing-1234", NEXT_PUBLIC_APP_URL: "https://example.test" },
  },
});
