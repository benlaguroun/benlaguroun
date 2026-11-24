// Server-side base URL used for checkout redirects and absolute links.
export const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const site = { url: siteUrl };
