import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { requireSession } from "@/lib/session";
import { formatPrice, productHref } from "@/lib/format";
import { PageIntro } from "@/components/section-heading";

export const metadata: Metadata = { title: "My library", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession("/dashboard");
  const userId = session.user.id;

  const [entitlements, orders] = await Promise.all([
    prisma.entitlement.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          include: { course: { include: { modules: { include: { lessons: { select: { id: true } } } } } } },
        },
      },
    }),
    prisma.order.findMany({
      where: { userId, status: { not: "PENDING" } },
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } } },
    }),
  ]);

  const progress = await prisma.lessonProgress.findMany({ where: { userId }, select: { lessonId: true } });
  const done = new Set(progress.map((p) => p.lessonId));

  const courses = entitlements.filter((e) => e.product.type === "COURSE");
  const templates = entitlements.filter((e) => e.product.type === "TEMPLATE");

  return (
    <>
      <PageIntro eyebrow="My library" title={`Welcome back, ${session.user.name.split(" ")[0]}`} />

      <div className="wrap space-y-14 py-12">
        {entitlements.length === 0 && (
          <div className="card p-8 text-center">
            <p className="display text-2xl font-semibold">Nothing here yet</p>
            <p className="mt-2 text-muted">Courses and templates you buy will appear here.</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/courses" className="btn-primary">Browse courses</Link>
              <Link href="/templates" className="btn-ghost">Browse templates</Link>
            </div>
          </div>
        )}

        {courses.length > 0 && (
          <section>
            <h2 className="display text-2xl font-semibold">My courses</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {courses.map(({ product }) => {
                const ids = product.course?.modules.flatMap((m) => m.lessons.map((l) => l.id)) ?? [];
                const pct = ids.length ? Math.round((ids.filter((id) => done.has(id)).length / ids.length) * 100) : 0;
                return (
                  <div key={product.id} className="card p-6">
                    <h3 className="display text-xl font-semibold">{product.name}</h3>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                      <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-muted">{pct}% complete</p>
                    <Link href={`/learn/${product.slug}`} className="btn-primary mt-5">
                      {pct === 0 ? "Start course" : "Continue"}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {templates.length > 0 && (
          <section>
            <h2 className="display text-2xl font-semibold">My templates</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {templates.map(({ product }) => (
                <div key={product.id} className="card flex items-center justify-between gap-4 p-6">
                  <div>
                    <h3 className="display text-lg font-semibold">{product.name}</h3>
                    <Link href={productHref(product)} className="text-sm text-muted hover:text-ink">Details</Link>
                  </div>
                  {product.deliveryUrl && (
                    <a href={product.deliveryUrl} target="_blank" rel="noreferrer" className="btn-dark">Download</a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {orders.length > 0 && (
          <section>
            <h2 className="display text-2xl font-semibold">Order history</h2>
            <div className="card mt-5 divide-y divide-line">
              {orders.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-sm">
                  <span className="font-medium">{o.product.name}</span>
                  <span className="text-muted">
                    {o.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })} ·{" "}
                    {formatPrice(o.amountCents, o.currency)} · {o.status.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
