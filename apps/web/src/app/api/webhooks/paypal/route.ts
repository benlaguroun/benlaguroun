import { NextResponse } from "next/server";
import { prisma } from "@brand/db";
import { getPayPalLink, verifyPayPalWebhook } from "@/lib/payments/paypal";
import { fulfillOrder, refundOrder } from "@/lib/orders";

type CaptureResource = {
  id: string;
  status?: string;
  custom_id?: string;
  amount?: { value: string; currency_code: string };
  links?: { rel: string; href: string }[];
};

export async function POST(req: Request) {
  const body = await req.text();

  let valid = false;
  try {
    valid = await verifyPayPalWebhook(req.headers, body);
  } catch (err) {
    console.error("PayPal webhook verification failed", err);
  }
  if (!valid) return NextResponse.json({ error: "Invalid signature." }, { status: 400 });

  const event = JSON.parse(body) as { event_type: string; resource: CaptureResource };

  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED": {
      const orderId = event.resource.custom_id;
      if (orderId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        const paid = event.resource.amount;
        // Only trust a payment that matches what we asked for.
        if (order && paid && paid.value === (order.amountCents / 100).toFixed(2) && paid.currency_code === order.currency.toUpperCase()) {
          await fulfillOrder(order.id);
        }
      }
      break;
    }
    case "PAYMENT.CAPTURE.REFUNDED":
    case "PAYMENT.CAPTURE.REVERSED": {
      // A refund points back to the payment it refunds; that payment knows our order id.
      const up = event.resource.links?.find((l) => l.rel === "up")?.href;
      const capture = up ? await getPayPalLink<CaptureResource>(up).catch(() => null) : null;
      const orderId = capture?.custom_id ?? event.resource.custom_id;
      if (orderId) await refundOrder(orderId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
