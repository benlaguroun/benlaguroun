import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { fill, getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { unsubscribe } from "@/app/newsletter-actions";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; done?: string }>;
};

// Unsubscribing needs a button press (a POST), not just opening the link, so
// email scanners that open every link can't unsubscribe people by accident.
export default async function UnsubscribePage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const t = getDict(locale).newsletter.unsubscribe;
  const { token, done } = await searchParams;

  const sub = !done && token ? await prisma.subscriber.findUnique({ where: { token } }) : null;

  return (
    <div className="wrap max-w-lg py-24">
      <div className="glass p-10 text-center">
        {done ? (
          <>
            <h1 className="display text-3xl font-semibold">{t.doneTitle}</h1>
            <p className="mt-3 text-mute">{t.doneBody}</p>
            <Link href={lp(locale)} className="btn btn-glass mt-7">{t.home}</Link>
          </>
        ) : sub ? (
          <>
            <h1 className="display text-3xl font-semibold">{t.title}</h1>
            <p className="mt-3 text-mute" dir="auto">{fill(t.body, { email: sub.email })}</p>
            <form action={unsubscribe} className="mt-7">
              <input type="hidden" name="token" value={sub.token} />
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-primary">{t.button}</button>
            </form>
          </>
        ) : (
          <>
            <p className="text-mute">{t.invalid}</p>
            <Link href={lp(locale)} className="btn btn-glass mt-7">{t.home}</Link>
          </>
        )}
      </div>
    </div>
  );
}
