import { prisma } from "@brand/db";
import { sendReceiptEmails } from "@/lib/receipt";
import { getStripe } from "@/lib/payments/stripe";
import { refundPayPalOrder } from "@/lib/payments/paypal";

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

  // Safe to call every time: it only sends once per order.
  await sendReceiptEmails(order.id);

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

/**
 * Sends the money back through the provider (Stripe or PayPal), then revokes
 * access. Other providers (Lemon Squeezy) have no refund call here: refund in
 * their dashboard, and this only revokes access.
 */
export async function refundOrderWithProvider(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false as const, reason: "Order not found." };
  if (order.status === "REFUNDED") return { ok: true as const, moneyReturned: false, note: "Already refunded." };
  if (order.status !== "PAID") return { ok: false as const, reason: "Only paid orders can be refunded." };

  let moneyReturned = false;
  if (order.provider === "stripe" && order.providerRef) {
    const session = await getStripe().checkout.sessions.retrieve(order.providerRef);
    const intent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    if (!intent) return { ok: false as const, reason: "Stripe has no payment for this order." };
    try {
      await getStripe().refunds.create({ payment_intent: intent }, { idempotencyKey: `refund-${order.id}` });
    } catch (err) {
      // Already refunded in the Stripe dashboard.
      if ((err as { code?: string }).code !== "charge_already_refunded") throw err;
    }
    moneyReturned = true;
  } else if (order.provider === "paypal" && order.providerRef) {
    await refundPayPalOrder(order.providerRef, order.id);
    moneyReturned = true;
  }

  await refundOrder(order.id);
  return { ok: true as const, moneyReturned };
}
