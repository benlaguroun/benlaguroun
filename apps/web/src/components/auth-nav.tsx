"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthNav() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return <span className="h-9 w-24" aria-hidden />;

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="hidden px-3 text-sm font-medium text-muted hover:text-ink sm:block">
          Log in
        </Link>
        <Link href="/signup" className="btn-dark">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="btn-ghost">
        My library
      </Link>
      <button
        type="button"
        className="px-3 text-sm font-medium text-muted hover:text-ink"
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
          router.refresh();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
