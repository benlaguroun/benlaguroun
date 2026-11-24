"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { lp, type Locale } from "@/i18n/config";

type Labels = { login: string; signup: string; library: string; signout: string };

/**
 * Account buttons. In the top bar (default) it stays compact; inside the
 * mobile menu (`stacked`) it becomes a full-width list with every action.
 */
export function AuthNav({ locale, labels, stacked = false }: { locale: Locale; labels: Labels; stacked?: boolean }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return stacked ? null : <span className="h-10 w-24" aria-hidden />;

  const wrap = stacked ? "grid gap-2" : "flex items-center gap-1.5";
  const btn = stacked ? "w-full" : "";
  const quiet = stacked
    ? "rounded-xl px-4 py-3 text-start text-base font-medium text-mute transition hover:bg-white/8 hover:text-ink"
    : "hidden px-3 text-sm font-medium text-mute transition hover:text-ink xl:block";

  if (!session) {
    return (
      <div className={wrap}>
        <Link href={lp(locale, "/login")} className={quiet}>
          {labels.login}
        </Link>
        <Link href={lp(locale, "/signup")} className={`btn btn-primary !px-4 !py-2.5 ${btn}`}>
          {labels.signup}
        </Link>
      </div>
    );
  }

  const isAdmin = (session.user as { role?: string | null }).role === "ADMIN";

  return (
    <div className={wrap}>
      {isAdmin && (
        <Link href={lp(locale, "/admin")} className={`btn btn-glass !px-4 !py-2.5 !text-aqua ${btn}`}>
          Admin
        </Link>
      )}
      <Link href={lp(locale, "/dashboard")} className={`btn btn-glass !px-4 !py-2.5 ${btn}`}>
        {labels.library}
      </Link>
      <button
        type="button"
        className={quiet}
        onClick={async () => {
          await authClient.signOut();
          router.push(lp(locale));
          router.refresh();
        }}
      >
        {labels.signout}
      </button>
    </div>
  );
}
