import type { Metadata } from "next";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { pageMetadata } from "@/lib/seo";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Reveal } from "@/components/reveal";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/forgot-password", title: getDict(locale).auth.forgot.title, noindex: true });
}

export default async function ForgotPasswordPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale).auth;

  return (
    <div className="wrap max-w-md py-20">
      <Reveal>
        <h1 className="display text-4xl font-semibold">
          <span className="text-gradient">{t.forgot.title}</span>
        </h1>
        <p className="mb-8 mt-3 text-mute">{t.forgot.sub}</p>
        <ForgotPasswordForm locale={locale} t={t} />
      </Reveal>
    </div>
  );
}
