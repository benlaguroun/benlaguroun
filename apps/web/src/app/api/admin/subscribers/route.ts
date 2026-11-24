import { prisma } from "@brand/db";
import { isAdminUser } from "@/lib/admin";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// CSV cells that start with = + - @ can run as formulas when opened in a
// spreadsheet, so they get a leading quote.
const cell = (v: string) => {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
};

/** Download of the active subscribers. Admins only. */
export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session.user)) return new Response("Not found", { status: 404 });

  const rows = await prisma.subscriber.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } });
  const csv = [
    "email,language,joined",
    ...rows.map((r) => [cell(r.email), cell(r.locale), cell(r.createdAt.toISOString().slice(0, 10))].join(",")),
  ].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
