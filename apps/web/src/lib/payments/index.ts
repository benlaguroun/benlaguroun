import { paypalProvider, paypalSupportsCurrency } from "./paypal";
import { stripeProvider } from "./stripe";
import type { PaymentProvider, ProviderName } from "./types";

const providers: Record<ProviderName, PaymentProvider> = {
  stripe: stripeProvider,
  paypal: paypalProvider,
};

// A method is offered at checkout only when its keys are set, so you can switch
// methods on and off from your environment variables, with no code changes.
const configured: Record<ProviderName, () => boolean> = {
  stripe: () => !!process.env.STRIPE_SECRET_KEY,
  paypal: () => !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
};

/**
 * The payment methods buyers can choose from, in display order.
 * Optionally set PAYMENT_PROVIDERS="stripe,paypal" to allow only some of them.
 */
export function availableProviders(currency?: string): PaymentProvider[] {
  const only = process.env.PAYMENT_PROVIDERS?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return (Object.keys(providers) as ProviderName[])
    .filter((name) => configured[name]() && (!only || only.includes(name)))
    // A method that can't charge this currency is simply not offered.
    .filter((name) => name !== "paypal" || !currency || paypalSupportsCurrency(currency))
    .map((name) => providers[name]);
}

export function getProvider(name: string | undefined, currency?: string): PaymentProvider | null {
  return availableProviders(currency).find((p) => p.name === name) ?? null;
}

export type { PaymentProvider, CheckoutInput, CheckoutResult, ProviderName } from "./types";
