import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSession, safeNext } from "@/lib/session";

export const metadata: Metadata = { title: "Create account" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ next?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);

  return (
    <div className="wrap max-w-md py-16">
      <h1 className="display text-3xl font-semibold">Create your account</h1>
      <p className="mb-6 mt-2 text-muted">One account for every course and template you buy.</p>
      <AuthForm mode="signup" next={next} />
    </div>
  );
}
