import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { emailConfigured, esc, sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site-url";

const copy: Record<Locale, { subject: string; title: string; body: string; visit: string; unsub: string }> = {
  en: {
    subject: "Welcome, you're on the list",
    title: "Thanks for subscribing",
    body: "You'll get occasional notes on building AI platforms and online businesses. No spam. If you ever want out, there's a link at the bottom of every email.",
    visit: "Visit the site",
    unsub: "Unsubscribe",
  },
  fr: {
    subject: "Bienvenue, vous êtes inscrit",
    title: "Merci de votre inscription",
    body: "Vous recevrez de temps en temps des notes sur la création de plateformes IA et d'entreprises en ligne. Pas de spam. Si vous voulez partir, un lien de désinscription figure en bas de chaque e-mail.",
    visit: "Visiter le site",
    unsub: "Se désabonner",
  },
  ar: {
    subject: "أهلًا بك، تم تسجيلك",
    title: "شكرًا لاشتراكك",
    body: "ستصلك من حين لآخر ملاحظات عن بناء منصات الذكاء الاصطناعي والأعمال عبر الإنترنت. بلا رسائل مزعجة. وإن أردت المغادرة فهناك رابط في أسفل كل رسالة.",
    visit: "زيارة الموقع",
    unsub: "إلغاء الاشتراك",
  },
};

export const unsubscribeUrl = (locale: Locale, token: string) => `${siteUrl}/${locale}/unsubscribe?token=${token}`;

/** Welcome email with a one-click unsubscribe link. Never throws. */
export async function sendWelcomeEmail(sub: { email: string; locale: Locale; token: string }) {
  if (!emailConfigured()) return;
  const c = copy[sub.locale];
  const unsub = unsubscribeUrl(sub.locale, sub.token);
  const home = `${siteUrl}/${sub.locale}`;
  const dir = sub.locale === "ar" ? "rtl" : "ltr";

  const html = `<div dir="${dir}" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
<h1 style="font-size:22px;margin:0 0 12px">${esc(c.title)}</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 20px">${esc(c.body)}</p>
<p style="margin:0 0 28px"><a href="${esc(home)}" style="color:#4f46e5">${esc(c.visit)}</a></p>
<p style="font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:14px">${esc(site.name)} · <a href="${esc(unsub)}" style="color:#666">${esc(c.unsub)}</a></p>
</div>`;
  const text = `${c.title}\n\n${c.body}\n\n${home}\n\n${c.unsub}: ${unsub}`;

  await sendEmail({ to: sub.email, subject: c.subject, html, text }).catch((err) =>
    console.error("Could not send the welcome email", err),
  );
}
