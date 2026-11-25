import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { localeMeta, type Locale, isLocale } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { emailConfigured, esc, ownerEmail, sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { providerLabel } from "@/lib/payments/labels";
import { siteUrl } from "@/lib/site-url";
import { LINK_DAYS, signedDownloadUrl } from "@/lib/downloads";
import { reportError } from "@/lib/errors";
import { companyFooter } from "@/lib/company";

// Email text lives here (not in the page dictionaries) because it is only used
// on the server.
const copy: Record<Locale, {
  subject: string; title: string; intro: string; order: string; date: string; method: string; amount: string;
  openCourse: string; openLibrary: string; download: string; linkNote: string; foot: string;
}> = {
  en: {
    subject: "Your receipt: {name}",
    title: "Thank you for your purchase",
    intro: "Your payment went through and {name} is ready for you.",
    order: "Order", date: "Date", method: "Paid with", amount: "Amount",
    openCourse: "Start the course", openLibrary: "Open my library",
    download: "Download your files",
    linkNote: "This download link works for {days} days. After that, sign in and download from your library.",
    foot: "Questions about your order? Just reply to this email.",
  },
  fr: {
    subject: "Votre reçu : {name}",
    title: "Merci pour votre achat",
    intro: "Votre paiement a bien été reçu et {name} est prêt pour vous.",
    order: "Commande", date: "Date", method: "Payé avec", amount: "Montant",
    openCourse: "Commencer la formation", openLibrary: "Ouvrir ma bibliothèque",
    download: "Télécharger vos fichiers",
    linkNote: "Ce lien de téléchargement est valable {days} jours. Ensuite, connectez-vous et téléchargez depuis votre bibliothèque.",
    foot: "Une question sur votre commande ? Répondez simplement à cet e-mail.",
  },
  ar: {
    subject: "إيصالك: {name}",
    title: "شكرًا لك على الشراء",
    intro: "تمّت عملية الدفع بنجاح و{name} جاهز لك.",
    order: "الطلب", date: "التاريخ", method: "طريقة الدفع", amount: "المبلغ",
    openCourse: "ابدأ الدورة", openLibrary: "افتح مكتبتي",
    download: "حمّل ملفاتك",
    linkNote: "رابط التحميل هذا صالح لمدة {days} أيام. بعد ذلك، سجّل الدخول وحمّل من مكتبتك.",
    foot: "لديك سؤال عن طلبك؟ يكفي أن ترد على هذه الرسالة.",
  },
};

/**
 * Sends the buyer's receipt and tells you about the sale. Runs at most once per
 * order, even if the webhook and the return page both fulfil it, and never
 * throws: a failed email must not break a payment.
 */
export async function sendReceiptEmails(orderId: string, opts: { resend?: boolean } = {}): Promise<"sent" | "skipped" | "failed"> {
  if (!emailConfigured()) return "skipped";
  const resend = !!opts.resend;

  // Claim the order first, so two simultaneous calls can't both send. A manual
  // resend skips the claim (the admin asked for it) and doesn't notify you again.
  if (resend) {
    const paid = await prisma.order.count({ where: { id: orderId, status: "PAID" } });
    if (!paid) return "skipped";
  } else {
    const claimed = await prisma.order.updateMany({
      where: { id: orderId, status: "PAID", receiptSentAt: null },
      data: { receiptSentAt: new Date() },
    });
    if (claimed.count !== 1) return "skipped";
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true, name: true } }, product: true },
    });
    if (!order) return "skipped";

    const locale: Locale = isLocale(order.locale) ? order.locale : "en";
    const c = copy[locale];
    const product = localize(order.product, locale);
    const price = formatPrice(order.amountCents, order.currency, locale, "");
    const ref = order.id.slice(-8).toUpperCase();
    const when = (order.paidAt ?? order.createdAt).toLocaleDateString(localeMeta[locale].intl, { dateStyle: "medium" });
    const method = providerLabel(order.provider);
    const isCourse = order.product.type === "COURSE";
    const hasFile = order.product.type === "TEMPLATE" && !!(order.product.deliveryFile || order.product.deliveryUrl);
    const library = `${siteUrl}/${locale}/dashboard`;
    // Templates get a signed link that works without signing in, for a week.
    const link = hasFile
      ? signedDownloadUrl(order.productId, order.userId)
      : `${siteUrl}/${locale}${isCourse ? `/learn/${order.product.slug}` : "/dashboard"}`;
    const buttonText = hasFile ? c.download : isCourse ? c.openCourse : c.openLibrary;
    const linkNote = hasFile ? c.linkNote.replace("{days}", String(LINK_DAYS)) : "";
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
<a href="${esc(link)}" style="display:inline-block;background:#6d28d9;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">${esc(buttonText)}</a>
${hasFile ? `<p style="margin:16px 0 0;font-size:13px;color:#64748b">${esc(linkNote)} <a href="${esc(library)}" style="color:#6d28d9">${esc(c.openLibrary)}</a></p>` : ""}
<p style="margin:28px 0 0;font-size:13px;color:#64748b">${esc(c.foot)}</p>
<p style="margin:12px 0 0;font-size:12px;color:#94a3b8">${esc(companyFooter())}</p>
</div></body></html>`;

    const text = `${c.title}\n\n${intro}\n\n${c.order}: ${ref}\n${c.date}: ${when}\n${c.method}: ${method}\n${c.amount}: ${price}\n\n${buttonText}: ${link}${hasFile ? `\n${linkNote}\n${library}` : ""}\n\n${c.foot}`;

    await sendEmail({ to: order.user.email, subject: c.subject.replace("{name}", product.name), html, text, replyTo: ownerEmail(site.email) });

    if (resend) {
      await prisma.order.update({ where: { id: orderId }, data: { receiptSentAt: new Date() } });
      return "sent";
    }

    // You get a short note about every sale, in English.
    const note = `${order.product.name}\n${formatPrice(order.amountCents, order.currency, "en", "")} via ${method}\nBuyer: ${order.user.name} <${order.user.email}>\nOrder ${ref}`;
    await sendEmail({
      to: ownerEmail(site.email),
      subject: `New sale: ${order.product.name} (${formatPrice(order.amountCents, order.currency, "en", "")})`,
      html: `<pre style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">${esc(note)}</pre>`,
      text: note,
    });
    return "sent";
  } catch (err) {
    console.error("Could not send receipt email", err);
    await reportError("email", err, `Receipt for order ${orderId}`);
    // Release the claim so a later webhook can try again (not after a manual resend,
    // where the original claim must stay).
    if (!resend) await prisma.order.update({ where: { id: orderId }, data: { receiptSentAt: null } }).catch(() => {});
    return "failed";
  }
}
