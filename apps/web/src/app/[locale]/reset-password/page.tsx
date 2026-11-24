import type { Metadata } from "next";
import Link from "next/link";
import { lp } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { pageMetadata } from "@/lib/seo";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; error?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/reset-password", title: getDict(locale).auth.reset.title, noindex: true });
}

export default async function ResetPasswordPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale).auth;
  const { token, error } = await searchParams;

  return (
    <div className="wrap max-w-md py-20">
      <Reveal>
        {token && !error ? (
          <>
            <h1 className="display text-4xl font-semibold">
              <span className="text-gradient">{t.reset.title}</span>
            </h1>
            <p className="mb-8 mt-3 text-mute">{t.reset.sub}</p>
            <ResetPasswordForm token={token} locale={locale} t={t} />
          </>
        ) : (
          <div className="glass p-8 text-center">
            <p className="text-mute">{t.reset.invalid}</p>
            <Link href={lp(locale, "/forgot-password")} className="btn btn-primary mt-7">{t.reset.requestNew}</Link>
          </div>
        )}
      </Reveal>
    </div>
  );
}
