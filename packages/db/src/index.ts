import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Reuse one client across hot reloads in development so we don't exhaust
// the Postgres connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    // Neon's free database sleeps when idle, and the first connection after a
    // pause can take several seconds. Wait for it instead of failing at once.
    connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 20_000,
    // Drop idle connections before the database can close them behind our back.
    idleTimeoutMillis: 10_000,
    keepAlive: true,
    max: Number(process.env.DB_POOL_MAX) || 10,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "../generated/prisma/client";
