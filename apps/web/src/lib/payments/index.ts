import { lemonSqueezyProvider } from "./lemonsqueezy";
import { stripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

/** Switch providers with the PAYMENT_PROVIDER env var. No code changes needed. */
export function getPaymentProvider(): PaymentProvider {
  const name = (process.env.PAYMENT_PROVIDER ?? "stripe").toLowerCase();
  if (name === "lemonsqueezy") return lemonSqueezyProvider;
  if (name === "stripe") return stripeProvider;
  throw new Error(`Unknown PAYMENT_PROVIDER "${name}". Use "stripe" or "lemonsqueezy".`);
}

export type { PaymentProvider, CheckoutInput, CheckoutResult } from "./types";
