"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { lp, type Locale } from "@/i18n/config";

type Labels = { login: string; signup: string; library: string; signout: string };

export function AuthNav({ locale, labels }: { locale: Locale; labels: Labels }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return <span className="h-9 w-20" aria-hidden />;

  if (!session) {
    return (
      <div className="flex items-center gap-1.5">
        <Link href={lp(locale, "/login")} className="hidden px-3 text-sm font-medium text-mute transition hover:text-ink lg:block">
          {labels.login}
        </Link>
        <Link href={lp(locale, "/signup")} className="btn btn-primary !px-4 !py-2.5">
          {labels.signup}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link href={lp(locale, "/dashboard")} className="btn btn-glass !px-4 !py-2.5">
        {labels.library}
      </Link>
      <button
        type="button"
        className="hidden px-3 text-sm font-medium text-mute transition hover:text-ink lg:block"
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
