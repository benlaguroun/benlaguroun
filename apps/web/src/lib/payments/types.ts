export type ProviderName = "stripe" | "paypal";

export type CheckoutInput = {
  orderId: string;
  locale: string;
  product: {
    name: string;
    description: string;
    priceCents: number;
    currency: string;
    stripePriceId?: string | null;
  };
  customer: { email: string; name: string };
  /** Where the provider sends the buyer after paying. */
  successUrl: string;
  /** Where the provider sends the buyer if they back out. */
  cancelUrl: string;
};

export type CheckoutResult = {
  /** Hosted payment page to send the customer to. */
  url: string;
  /** Provider-side id (Stripe session, PayPal order...), saved on the order. */
  providerRef?: string;
};

/**
 * Every payment provider implements this. Webhooks live in
 * app/api/webhooks/<provider>/route.ts and call fulfillOrder().
 */
export interface PaymentProvider {
  name: ProviderName;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
}
