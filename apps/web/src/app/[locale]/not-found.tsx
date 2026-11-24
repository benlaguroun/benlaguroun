"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale, lp } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale) ? params.locale : defaultLocale;
  const t = getDict(locale).notFound;

  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="display text-8xl font-semibold text-gradient">404</p>
        <h1 className="display mt-4 text-3xl font-semibold">{t.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-mute">{t.body}</p>
        <Link href={lp(locale)} className="btn btn-primary mt-8">{t.home}</Link>
      </div>
    </div>
  );
}
