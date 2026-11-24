export type CheckoutInput = {
  orderId: string;
  product: {
    name: string;
    description: string;
    priceCents: number;
    currency: string;
    stripePriceId?: string | null;
    lemonVariantId?: string | null;
  };
  customer: { email: string; name: string };
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutResult = {
  /** Hosted checkout page to send the customer to. */
  url: string;
  /** Provider-side id if known at creation time. */
  providerRef?: string;
};

/**
 * Every payment provider implements this. Webhooks live in
 * app/api/webhooks/<provider>/route.ts and call fulfillOrder().
 */
export interface PaymentProvider {
  name: "stripe" | "lemonsqueezy";
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
}
