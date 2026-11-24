import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { lp } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { getSession, safeNext } from "@/lib/session";
import { AuthForm } from "@/components/auth-form";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getDict(locale).auth.loginTitle };
}

export default async function Page({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale).auth;
  const next = safeNext((await searchParams).next, lp(locale, "/dashboard"));
  if (await getSession()) redirect(next);

  return (
    <div className="wrap max-w-md py-20">
      <Reveal>
        <h1 className="display text-4xl font-semibold">
          <span className="text-gradient">{t.loginTitle}</span>
        </h1>
        <p className="mb-8 mt-3 text-mute">{t.loginSub}</p>
        <AuthForm mode="login" next={next} locale={locale} t={t} />
      </Reveal>
    </div>
  );
}
