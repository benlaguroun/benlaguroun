// Server-side base URL used for checkout redirects and absolute links.
export const site = {
  url: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};
