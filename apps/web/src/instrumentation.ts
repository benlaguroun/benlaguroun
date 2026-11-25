import type { Instrumentation } from "next";

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
