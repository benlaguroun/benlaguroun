import { siteUrl } from "@/lib/site-url";
import type { PaymentProvider } from "./types";

// PayPal Orders v2. The flow:
//   1. createCheckout() creates a PayPal order and returns its approval link.
//   2. The buyer approves the payment on paypal.com and comes back to
//      /api/paypal/return, which calls capturePayPalOrder() to take the money.
//   3. The PAYMENT.CAPTURE.* webhook is a safety net (and handles refunds).

const API =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

// Currencies PayPal can charge with two decimals. MAD, for example, is not
// supported, so PayPal is hidden at checkout for products priced in it.
// (JPY, HUF and TWD are left out on purpose: they have no cents.)
const SUPPORTED = new Set([
  "AUD", "BRL", "CAD", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "ILS", "MXN", "MYR",
  "NOK", "NZD", "PHP", "PLN", "SEK", "SGD", "THB", "USD", "CHF",
]);

export function paypalSupportsCurrency(currency: string) {
  return SUPPORTED.has(currency.toUpperCase());
}

export function paypalConfigured() {
  return !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

let cached: { token: string; expires: number } | null = null;

async function accessToken() {
  if (cached && cached.expires > Date.now() + 30_000) return cached.token;

  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set");

  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal sign-in failed (${res.status})`);

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: json.access_token, expires: Date.now() + json.expires_in * 1000 };
  return cached.token;
}

async function paypal<T>(path: string, init: { method?: string; body?: unknown; requestId?: string } = {}): Promise<T> {
  const res = await fetch(path.startsWith("http") ? path : `${API}${path}`, {
    method: init.method ?? (init.body === undefined ? "GET" : "POST"),
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
      ...(init.requestId ? { "PayPal-Request-Id": init.requestId } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw Object.assign(new Error(`PayPal request failed (${res.status}): ${await res.text()}`), { status: res.status });
  }
  return (await res.json()) as T;
}

const money = (cents: number) => (cents / 100).toFixed(2);

type PayPalOrder = {
  id: string;
  status: string;
  links?: { rel: string; href: string }[];
  purchase_units?: {
    custom_id?: string;
    payments?: {
      captures?: { id: string; status: string; amount: { value: string; currency_code: string }; custom_id?: string }[];
    };
  }[];
};

export const paypalProvider: PaymentProvider = {
  name: "paypal",

  async createCheckout({ orderId, locale, product, customer, cancelUrl }) {
    const order = await paypal<PayPalOrder>("/v2/checkout/orders", {
      requestId: orderId,
      body: {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId,
            custom_id: orderId,
            invoice_id: orderId,
            description: product.name.slice(0, 127),
            amount: { currency_code: product.currency.toUpperCase(), value: money(product.priceCents) },
          },
        ],
        payment_source: {
          paypal: {
            email_address: customer.email,
            experience_context: {
              brand_name: "Ben Laguroun",
              user_action: "PAY_NOW",
              shipping_preference: "NO_SHIPPING",
              // Left out for Arabic so PayPal uses the buyer's own language setting.
              ...(locale === "en" || locale === "fr" ? { locale: locale === "fr" ? "fr-FR" : "en-US" } : {}),
              return_url: `${siteUrl}/api/paypal/return?order=${orderId}&locale=${locale}`,
              cancel_url: cancelUrl,
            },
          },
        },
      },
    });

    const approve = order.links?.find((l) => l.rel === "payer-action" || l.rel === "approve");
    if (!approve) throw new Error("PayPal did not return an approval link");
    return { url: approve.href, providerRef: order.id };
  },
};

export type CaptureResult =
  | { status: "completed"; captureId: string; amount: string; currency: string; customId?: string }
  | { status: "pending" }
  | { status: "failed" };

/** Take the money for an order the buyer has approved. Safe to call twice. */
export async function capturePayPalOrder(paypalOrderId: string): Promise<CaptureResult> {
  let order: PayPalOrder;
  try {
    order = await paypal<PayPalOrder>(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
      method: "POST",
      body: {},
      requestId: `capture-${paypalOrderId}`,
    });
  } catch (err) {
    // Already captured (the buyer refreshed the page): read the order instead.
    if ((err as { status?: number }).status === 422) {
      order = await paypal<PayPalOrder>(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`);
    } else {
      throw err;
    }
  }

  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  if (order.status === "COMPLETED" && capture?.status === "COMPLETED") {
    return {
      status: "completed",
      captureId: capture.id,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
      customId: capture.custom_id ?? order.purchase_units?.[0]?.custom_id,
    };
  }
  if (capture?.status === "PENDING") return { status: "pending" };
  return { status: "failed" };
}

/** Confirms a webhook really came from PayPal. Needs PAYPAL_WEBHOOK_ID. */
export async function verifyPayPalWebhook(headers: Headers, body: string) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const result = await paypal<{ verification_status: string }>("/v1/notifications/verify-webhook-signature", {
    body: {
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    },
  });
  return result.verification_status === "SUCCESS";
}

/** Fetch a PayPal link from a webhook. Only PayPal's own API host is allowed. */
export async function getPayPalLink<T>(href: string): Promise<T | null> {
  if (!href.startsWith(`${API}/`)) return null;
  return paypal<T>(href);
}
