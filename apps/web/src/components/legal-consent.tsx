import Link from "next/link";
import { lp, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

/** "By paying you agree to the Terms and the Refunds", with both words as links. */
export function LegalConsent({ locale }: { locale: Locale }) {
  const t = getDict(locale).legal;
  const parts = t.consent.split(/(\{terms\}|\{refunds\})/);
  return (
    <p className="mt-4 text-xs leading-relaxed text-mute">
      {parts.map((part, i) => {
        if (part === "{terms}")
          return <Link key={i} href={lp(locale, "/terms")} target="_blank" className="text-aqua hover:underline">{t.terms}</Link>;
        if (part === "{refunds}")
          return <Link key={i} href={lp(locale, "/refunds")} target="_blank" className="text-aqua hover:underline">{t.refunds}</Link>;
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
