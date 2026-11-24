import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@brand/db";
import { requireSession } from "@/lib/session";
import { productHref } from "@/lib/format";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ order?: string }> };

export default async function CheckoutSuccess({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  const session = await requireSession("/dashboard");

  const order = orderId
    ? await prisma.order.findFirst({
        where: { id: orderId, userId: session.user.id },
        include: { product: true },
      })
    : null;

  const paid = order?.status === "PAID";

  return (
    <div className="wrap max-w-xl py-20 text-center">
      <h1 className="display text-4xl font-semibold">{paid ? "You're in. Thank you!" : "Payment received"}</h1>
      <p className="mt-4 text-muted">
        {paid
          ? `${order?.product.name} is now in your library.`
          : "Your purchase is being confirmed. This usually takes a few seconds. Refresh this page or check your library shortly."}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/dashboard" className="btn-primary">Open my library</Link>
        {order && <Link href={productHref(order.product)} className="btn-ghost">View product</Link>}
      </div>
    </div>
  );
}
