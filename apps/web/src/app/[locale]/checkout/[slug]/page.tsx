import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { formatPrice, productPath } from "@/lib/format";
import { userOwns } from "@/lib/access";
import { availableProviders } from "@/lib/payments";
import { requireSession } from "@/lib/session";
import { needsVerification } from "@/lib/verification";
import { VerifyEmailNotice } from "@/components/verify-email-notice";
import { ArrowBack, Check } from "@/components/icons";
import { CheckoutForm, type Method } from "@/components/checkout-form";
import { LegalConsent } from "@/components/legal-consent";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ cancelled?: string; error?: string }>;
};

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const c = t.checkout;
  const { cancelled, error } = await searchParams;

  // Step 1: you must be signed in, then you come straight back here.
  const session = await requireSession(locale, lp(locale, `/checkout/${slug}`));

  const raw = await prisma.product.findUnique({ where: { slug } });
  if (!raw || !raw.published || raw.type === "SERVICE" || raw.priceCents == null) notFound();
  const product = localize(raw, locale);

  // Already bought: go to the product page, which shows the download or course.
  if (await userOwns(session.user as { id: string; role?: string | null }, raw.id)) {
    redirect(lp(locale, productPath(raw)));
  }

  const price = formatPrice(raw.priceCents, raw.currency, locale, "");
  const labels: Record<string, Method> = {
    stripe: { name: "stripe", title: c.stripeTitle, body: c.stripeBody },
    paypal: { name: "paypal", title: c.paypalTitle, body: c.paypalBody },
  };
  const methods = availableProviders(raw.currency).map((p) => labels[p.name]!);
  // Nothing can be charged yet (no payment keys): the product page shows "coming soon" instead.
  if (methods.length === 0) redirect(lp(locale, productPath(raw)));
  const unverified = needsVerification(session.user as { emailVerified?: boolean; role?: string });
  // Better Auth sends people back here with ?error=invalid_token when a confirmation link is bad or old.
  const linkError = !!error && /token/i.test(error);
  const checkoutPath = lp(locale, `/checkout/${slug}`);

  return (
    <div className="wrap max-w-5xl py-14">
      <Link href={lp(locale, productPath(raw))} className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink">
        <ArrowBack /> {product.name}
      </Link>

      <h1 className="display mt-5 text-4xl font-semibold sm:text-5xl">
        <span className="text-gradient">{c.title}</span>
      </h1>

      {/* Where you are in the purchase */}
      <ol className="mt-6 flex flex-wrap items-center gap-3 text-sm" aria-label={c.title}>
        {c.steps.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full font-mono text-xs ${
                i === 1 ? "bg-aqua text-void" : i === 0 ? "bg-white/15 text-ink" : "border border-line text-mute"
              }`}
            >
              {i === 0 ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className={i === 1 ? "font-semibold" : "text-mute"}>{label}</span>
            {i < c.steps.length - 1 && <span aria-hidden className="h-px w-8 bg-line" />}
          </li>
        ))}
      </ol>

      {cancelled && (
        <p className="mt-8 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-mute">{c.cancelled}</p>
      )}
      {error && !linkError && (
        <p role="alert" className="mt-8 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
          {c.returnFailed}
        </p>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <section className="glass p-7">
            <p className="eyebrow">{c.summary}</p>
            <p className="mt-4 text-xs font-medium text-aqua">{t.product.types[raw.type]}</p>
            <h2 className="display mt-1 text-2xl font-semibold">{product.name}</h2>
            <p className="mt-2 text-sm text-mute">{product.tagline}</p>

            <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
              <span className="text-sm text-mute">{t.product.oneTime}</span>
              <span className="display text-4xl font-semibold">{price}</span>
            </div>

            <p className="mt-5 flex gap-3 rounded-xl bg-white/5 p-4 text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-aqua/15 text-aqua">
                <Check className="h-3 w-3" />
              </span>
              {raw.type === "COURSE" ? c.accessCourse : c.accessTemplate}
            </p>
          </section>
        </Reveal>

        <Reveal delay={100}>
          <section className="glass p-7">
            <h2 className="display text-xl font-semibold">{c.method}</h2>
            <p className="mt-1 text-xs text-mute">{fill(c.signedInAs, { email: session.user.email })}</p>

            <div className="mt-6">
              {unverified ? (
                <div className="space-y-4">
                  {linkError && <p role="alert" className="text-sm text-rose">{c.verify.invalidLink}</p>}
                  <VerifyEmailNotice email={session.user.email} callbackURL={checkoutPath} labels={c.verify} />
                  <Link href={checkoutPath} className="btn btn-primary w-full">{c.verify.refresh}</Link>
                </div>
              ) : methods.length === 0 ? (
                <div>
                  <p className="text-sm text-mute">{c.noMethods}</p>
                  <Link href={lp(locale, "/contact")} className="btn btn-primary mt-5">
                    {t.nav.contact}
                  </Link>
                </div>
              ) : (
                <CheckoutForm
                  productId={raw.id}
                  locale={locale}
                  methods={methods}
                  payLabel={fill(c.pay, { price })}
                  processing={c.processing}
                  secureNote={c.secure}
                  errors={t.errors}
                />
              )}
              {!unverified && methods.length > 0 && <LegalConsent locale={locale} />}
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
