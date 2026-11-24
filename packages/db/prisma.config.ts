import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 reads the connection string from here, not from schema.prisma.
// We read process.env directly so `prisma generate` works without a database.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/brand_platform",
  },
});
