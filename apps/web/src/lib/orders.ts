import { prisma } from "@brand/db";

/**
 * Mark an order as paid and grant the entitlement. Safe to call more than
 * once (webhooks are retried), so every step is idempotent.
 */
export async function fulfillOrder(orderId: string, providerRef?: string | null) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false as const, reason: "order-not-found" };

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paidAt: order.paidAt ?? new Date(),
        ...(providerRef ? { providerRef } : {}),
      },
    }),
    prisma.entitlement.upsert({
      where: { userId_productId: { userId: order.userId, productId: order.productId } },
      update: { orderId: order.id },
      create: { userId: order.userId, productId: order.productId, orderId: order.id },
    }),
  ]);

  return { ok: true as const };
}

/** Mark an order refunded and revoke access. */
export async function refundOrder(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false as const, reason: "order-not-found" };

  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: "REFUNDED" } }),
    prisma.entitlement.deleteMany({ where: { orderId: order.id } }),
  ]);

  return { ok: true as const };
}
