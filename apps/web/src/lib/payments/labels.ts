/** Human-readable name of a provider as stored on an order. */
export function providerLabel(name: string) {
  switch (name) {
    case "paypal":
      return "PayPal";
    case "free":
      return "Free (coupon)";
    default:
      return "Stripe";
  }
}
