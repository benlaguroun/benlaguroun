// Sends transactional email through Brevo's HTTP API (no extra package needed).
// If the keys aren't set, nothing is sent and the site keeps working, so email
// is always optional. Needs BREVO_API_KEY and EMAIL_FROM (a sender you have
// verified in Brevo).

export function emailConfigured() {
  return !!(process.env.BREVO_API_KEY && process.env.EMAIL_FROM);
}

type Message = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/** Returns true when the email was handed to Brevo. Throws if Brevo refuses it. */
export async function sendEmail({ to, subject, html, text, replyTo }: Message) {
  if (!emailConfigured()) return false;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY as string,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME || "Ben Laguroun" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Brevo refused the email (${res.status}): ${await res.text()}`);
  return true;
}

/** Escape text before putting it in HTML. */
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Where owner notifications go: ADMIN_NOTIFY_EMAIL, or your public site email. */
export function ownerEmail(fallback: string) {
  return process.env.ADMIN_NOTIFY_EMAIL || fallback;
}
