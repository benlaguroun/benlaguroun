import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSession, safeNext } from "@/lib/session";

export const metadata: Metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);

  return (
    <div className="wrap max-w-md py-16">
      <h1 className="display text-3xl font-semibold">Welcome back</h1>
      <p className="mb-6 mt-2 text-muted">Log in to access your courses and downloads.</p>
      <AuthForm mode="login" next={next} />
    </div>
  );
}
