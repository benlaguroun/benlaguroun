import type { Instrumentation } from "next";

/** Runs once when the server starts. In production, shout if the site still thinks it lives on localhost. */
export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const auth = process.env.BETTER_AUTH_URL ?? "";
  if (!app || !auth || /localhost|127\.0\.0\.1/.test(app + auth)) {
    console.warn(
      "[setup] NEXT_PUBLIC_APP_URL / BETTER_AUTH_URL still point at localhost. Emails, the sitemap and sign-in links will be wrong. Set both to your real https:// address and rebuild.",
    );
  }
}

/**
 * Next.js calls this for every error that happens on the server while serving
 * a page, a route or a form action. It feeds the Errors page in the admin and
 * the alert email.
 */
export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { reportError } = await import("@/lib/errors");
  await reportError("server", err, `${request.method} ${request.path}`);
};
