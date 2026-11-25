import { prisma } from "@brand/db";

export const dynamic = "force-dynamic";

// A tiny public endpoint for uptime monitors (UptimeRobot, Better Stack, ...).
// It answers 200 when the site and the database are up and 503 when they are not, and
// reveals nothing else. Point a monitor at https://yourdomain.com/api/health every 5 minutes.
export async function GET() {
  let db = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = true;
  } catch {
    db = false;
  }
  return Response.json({ ok: db, db }, { status: db ? 200 : 503, headers: { "cache-control": "no-store" } });
}
