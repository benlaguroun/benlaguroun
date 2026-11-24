import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { fulfillOrder, refundOrder } from "@/lib/orders";

type LemonEvent = {
  meta: { event_name: string; custom_data?: { order_id?: string } };
  data: { id: string; attributes: { status?: string } };
};

export async function POST(req: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const signature = req.headers.get("x-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const body = await req.text();
  const expected = createHmac("sha256", secret).update(body).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(body) as LemonEvent;
  const orderId = event.meta.custom_data?.order_id;
  if (!orderId) return NextResponse.json({ received: true });

  switch (event.meta.event_name) {
    case "order_created":
      if (event.data.attributes.status === "paid") {
        await fulfillOrder(orderId, `ls_${event.data.id}`);
      }
      break;
    case "order_refunded":
      await refundOrder(orderId);
      break;
  }

  return NextResponse.json({ received: true });
}
