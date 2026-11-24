import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { localeMeta, type Locale, isLocale } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { emailConfigured, esc, ownerEmail, sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { providerLabel } from "@/lib/payments/labels";
import { siteUrl } from "@/lib/site-url";

// Email text lives here (not in the page dictionaries) because it is only used
// on the server.
const copy: Record<Locale, {
  subject: string; title: string; intro: string; order: string; date: string; method: string; amount: string;
  openCourse: string; openLibrary: string; foot: string;
}> = {
  en: {
    subject: "Your receipt: {name}",
    title: "Thank you for your purchase",
    intro: "Your payment went through and {name} is ready for you.",
    order: "Order", date: "Date", method: "Paid with", amount: "Amount",
    openCourse: "Start the course", openLibrary: "Open my library",
    foot: "Questions about your order? Just reply to this email.",
  },
  fr: {
    subject: "Votre reçu : {name}",
    title: "Merci pour votre achat",
    intro: "Votre paiement a bien été reçu et {name} est prêt pour vous.",
    order: "Commande", date: "Date", method: "Payé avec", amount: "Montant",
    openCourse: "Commencer la formation", openLibrary: "Ouvrir ma bibliothèque",
    foot: "Une question sur votre commande ? Répondez simplement à cet e-mail.",
  },
  ar: {
    subject: "إيصالك: {name}",
    title: "شكرًا لك على الشراء",
    intro: "تمّت عملية الدفع بنجاح و{name} جاهز لك.",
    order: "الطلب", date: "التاريخ", method: "طريقة الدفع", amount: "المبلغ",
    openCourse: "ابدأ الدورة", openLibrary: "افتح مكتبتي",
    foot: "لديك سؤال عن طلبك؟ يكفي أن ترد على هذه الرسالة.",
  },
};

/**
 * Sends the buyer's receipt and tells you about the sale. Runs at most once per
 * order, even if the webhook and the return page both fulfil it, and never
 * throws: a failed email must not break a payment.
 */
export async function sendReceiptEmails(orderId: string) {
  if (!emailConfigured()) return;

  // Claim the order first, so two simultaneous calls can't both send.
  const claimed = await prisma.order.updateMany({
    where: { id: orderId, status: "PAID", receiptSentAt: null },
    data: { receiptSentAt: new Date() },
  });
  if (claimed.count !== 1) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true, name: true } }, product: true },
    });
    if (!order) return;

    const locale: Locale = isLocale(order.locale) ? order.locale : "en";
    const c = copy[locale];
    const product = localize(order.product, locale);
    const price = formatPrice(order.amountCents, order.currency, locale, "");
    const ref = order.id.slice(-8).toUpperCase();
    const when = (order.paidAt ?? order.createdAt).toLocaleDateString(localeMeta[locale].intl, { dateStyle: "medium" });
    const method = providerLabel(order.provider);
    const isCourse = order.product.type === "COURSE";
    const link = `${siteUrl}/${locale}${isCourse ? `/learn/${order.product.slug}` : "/dashboard"}`;
    const dir = localeMeta[locale].dir;
    const align = dir === "rtl" ? "right" : "left";
    const intro = c.intro.replace("{name}", product.name);

    const row = (k: string, v: string) =>
      `<tr><td style="padding:6px 0;color:#64748b">${esc(k)}</td><td style="padding:6px 0;text-align:${dir === "rtl" ? "left" : "right"};font-weight:600">${esc(v)}</td></tr>`;

    const html = `<!doctype html><html lang="${locale}" dir="${dir}"><body style="margin:0;background:#f1f5f9;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;text-align:${align}">
<p style="margin:0 0 4px;font-size:13px;color:#64748b">${esc(site.name)}</p>
<h1 style="margin:0 0 12px;font-size:24px">${esc(c.title)}</h1>
<p style="margin:0 0 24px;line-height:1.6">${esc(intro)}</p>
<table style="width:100%;border-collapse:collapse;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;margin-bottom:24px">
${row(c.order, ref)}${row(c.date, when)}${row(c.method, method)}${row(c.amount, price)}
</table>
<a href="${esc(link)}" style="display:inline-block;background:#6d28d9;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">${esc(isCourse ? c.openCourse : c.openLibrary)}</a>
<p style="margin:28px 0 0;font-size:13px;color:#64748b">${esc(c.foot)}</p>
</div></body></html>`;

    const text = `${c.title}\n\n${intro}\n\n${c.order}: ${ref}\n${c.date}: ${when}\n${c.method}: ${method}\n${c.amount}: ${price}\n\n${link}\n\n${c.foot}`;

    await sendEmail({ to: order.user.email, subject: c.subject.replace("{name}", product.name), html, text, replyTo: ownerEmail(site.email) });

    // You get a short note about every sale, in English.
    const note = `${order.product.name}\n${formatPrice(order.amountCents, order.currency, "en", "")} via ${method}\nBuyer: ${order.user.name} <${order.user.email}>\nOrder ${ref}`;
    await sendEmail({
      to: ownerEmail(site.email),
      subject: `New sale: ${order.product.name} (${formatPrice(order.amountCents, order.currency, "en", "")})`,
      html: `<pre style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">${esc(note)}</pre>`,
      text: note,
    });
  } catch (err) {
    console.error("Could not send receipt email", err);
    // Release the claim so a later webhook can try again.
    await prisma.order.update({ where: { id: orderId }, data: { receiptSentAt: null } }).catch(() => {});
  }
}
