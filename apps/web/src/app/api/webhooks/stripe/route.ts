import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { fulfillOrder, refundOrder } from "@/lib/orders";
import { prisma } from "@brand/db";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  // Signature verification needs the exact raw body.
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId ?? session.client_reference_id;
      if (orderId && session.payment_status === "paid") {
        await fulfillOrder(orderId, session.id);
      }
      break;
    }
    case "charge.refunded": {
      // Look the order up via the payment intent's checkout session.
      const charge = event.data.object as Stripe.Charge;
      if (typeof charge.payment_intent === "string") {
        const sessions = await getStripe().checkout.sessions.list({
          payment_intent: charge.payment_intent,
          limit: 1,
        });
        const sessionId = sessions.data[0]?.id;
        if (sessionId) {
          const order = await prisma.order.findUnique({ where: { providerRef: sessionId } });
          if (order && charge.refunded) await refundOrder(order.id);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
