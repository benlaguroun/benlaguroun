import type { PaymentProvider } from "./types";

const API = "https://api.lemonsqueezy.com/v1";

// Lemon Squeezy is a merchant of record: it collects and remits sales tax/VAT
// for you. Each product needs a variant created in your LS dashboard; paste its
// id into Product.lemonVariantId. We override the price per checkout with
// custom_price so the amount always matches your catalog.
export const lemonSqueezyProvider: PaymentProvider = {
  name: "lemonsqueezy",

  async createCheckout({ orderId, product, customer, successUrl }) {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    if (!apiKey || !storeId) {
      throw new Error("LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID must be set");
    }
    if (!product.lemonVariantId) {
      throw new Error(`Product "${product.name}" has no lemonVariantId`);
    }

    const res = await fetch(`${API}/checkouts`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            custom_price: product.priceCents,
            checkout_data: {
              email: customer.email,
              name: customer.name,
              custom: { order_id: orderId },
            },
            product_options: { redirect_url: successUrl },
          },
          relationships: {
            store: { data: { type: "stores", id: storeId } },
            variant: { data: { type: "variants", id: product.lemonVariantId } },
          },
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Lemon Squeezy checkout failed (${res.status}): ${await res.text()}`);
    }

    const json = (await res.json()) as { data?: { attributes?: { url?: string } } };
    const url = json.data?.attributes?.url;
    if (!url) throw new Error("Lemon Squeezy did not return a checkout URL");
    return { url };
  },
};
