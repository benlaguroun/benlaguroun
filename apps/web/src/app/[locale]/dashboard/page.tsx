import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { formatPrice, productPath } from "@/lib/format";
import { requireSession } from "@/lib/session";
import { needsVerification } from "@/lib/verification";
import { VerifyEmailNotice } from "@/components/verify-email-notice";
import { Reveal } from "@/components/reveal";
import { PageIntro } from "@/components/section-heading";
import { localeMeta } from "@/i18n/config";

export const metadata: Metadata = { title: "Library", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const session = await requireSession(locale, lp(locale, "/dashboard"));
  const userId = session.user.id;

  const [entitlements, orders, progress] = await Promise.all([
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
      include: { product: true },
    }),
    prisma.lessonProgress.findMany({ where: { userId }, select: { lessonId: true } }),
  ]);

  const done = new Set(progress.map((p) => p.lessonId));
  const courses = entitlements.filter((e) => e.product.type === "COURSE");
  const templates = entitlements.filter((e) => e.product.type === "TEMPLATE");
  const firstName = session.user.name.split(" ")[0] ?? session.user.name;

  return (
    <>
      <PageIntro eyebrow={t.dashboard.eyebrow} title={fill(t.dashboard.welcome, { name: firstName })} />

      <div className="wrap space-y-16 py-14">
        {needsVerification(session.user as { emailVerified?: boolean; role?: string }) && (
          <VerifyEmailNotice email={session.user.email} callbackURL={lp(locale, "/dashboard")} labels={t.checkout.verify} compact />
        )}

        {entitlements.length === 0 && (
          <div className="glass p-10 text-center">
            <p className="display text-2xl font-semibold">{t.dashboard.emptyTitle}</p>
            <p className="mt-2 text-mute">{t.dashboard.emptyBody}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={lp(locale, "/courses")} className="btn btn-primary">{t.dashboard.browseCourses}</Link>
              <Link href={lp(locale, "/templates")} className="btn btn-glass">{t.dashboard.browseTemplates}</Link>
            </div>
          </div>
        )}

        {courses.length > 0 && (
          <section>
            <h2 className="display text-2xl font-semibold">{t.dashboard.myCourses}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {courses.map(({ product: raw }, i) => {
                const product = localize(raw, locale);
                const ids = raw.course?.modules.flatMap((m) => m.lessons.map((l) => l.id)) ?? [];
                const pct = ids.length ? Math.round((ids.filter((id) => done.has(id)).length / ids.length) * 100) : 0;
                return (
                  <Reveal key={raw.id} delay={i * 80}>
                    <div className="glass spot p-7">
                      <h3 className="display text-xl font-semibold">{product.name}</h3>
                      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-iris to-aqua" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-2 font-mono text-xs text-mute">{fill(t.dashboard.percent, { n: pct })}</p>
                      <Link href={lp(locale, `/learn/${raw.slug}`)} className="btn btn-primary mt-6">
                        {pct === 0 ? t.dashboard.startCourse : t.dashboard.continue}
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {templates.length > 0 && (
          <section>
            <h2 className="display text-2xl font-semibold">{t.dashboard.myTemplates}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {templates.map(({ product: raw }, i) => {
                const product = localize(raw, locale);
                return (
                  <Reveal key={raw.id} delay={i * 80}>
                    <div className="glass spot flex items-center justify-between gap-4 p-7">
                      <div>
                        <h3 className="display text-lg font-semibold">{product.name}</h3>
                        <Link href={lp(locale, productPath(raw))} className="text-sm text-mute hover:text-ink">
                          {t.dashboard.details}
                        </Link>
                      </div>
                      {(raw.deliveryFile || raw.deliveryUrl) && (
                        <a href={`/api/download/${raw.id}`} className="btn btn-primary">
                          {t.product.download}
                        </a>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {orders.length > 0 && (
          <section>
            <h2 className="display text-2xl font-semibold">{t.dashboard.history}</h2>
            <div className="glass mt-6 divide-y divide-line">
              {orders.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 text-sm">
                  <span className="font-medium">{localize(o.product, locale).name}</span>
                  <span className="text-mute">
                    {o.createdAt.toLocaleDateString(localeMeta[locale].intl, { dateStyle: "medium" })} ·{" "}
                    {formatPrice(o.amountCents, o.currency, locale, "")} · {t.dashboard.status[o.status]}
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
