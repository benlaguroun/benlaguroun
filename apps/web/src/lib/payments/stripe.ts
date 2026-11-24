import Stripe from "stripe";
import type { PaymentProvider } from "./types";

let client: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  client ??= new Stripe(key);
  return client;
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createCheckout({ orderId, locale, product, customer, successUrl, cancelUrl }) {
    const stripe = getStripe();

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = product.stripePriceId
      ? { price: product.stripePriceId, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.priceCents,
            product_data: { name: product.name, description: product.description.slice(0, 300) },
          },
        };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      customer_email: customer.email,
      // Stripe's checkout page has no Arabic, so it picks the browser language.
      locale: locale === "fr" ? "fr" : locale === "en" ? "en" : "auto",
      client_reference_id: orderId,
      metadata: { orderId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return { url: session.url, providerRef: session.id };
  },
};
