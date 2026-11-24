import { site } from "@/config/site";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { emailConfigured, esc, sendEmail } from "@/lib/email";

const copy: Record<Locale, { subject: string; title: string; body: string; button: string; ignore: string; expires: string }> = {
  en: {
    subject: "Reset your password",
    title: "Reset your password",
    body: "We received a request to reset the password for your account. Click the button to choose a new one.",
    button: "Choose a new password",
    expires: "This link works for one hour.",
    ignore: "If you didn't ask for this, you can ignore this email. Your password stays the same.",
  },
  fr: {
    subject: "Réinitialisez votre mot de passe",
    title: "Réinitialisez votre mot de passe",
    body: "Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Cliquez sur le bouton pour en choisir un nouveau.",
    button: "Choisir un nouveau mot de passe",
    expires: "Ce lien est valable une heure.",
    ignore: "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail. Votre mot de passe ne change pas.",
  },
  ar: {
    subject: "إعادة تعيين كلمة المرور",
    title: "إعادة تعيين كلمة المرور",
    body: "وصلنا طلب لإعادة تعيين كلمة مرور حسابك. اضغط على الزر لاختيار كلمة مرور جديدة.",
    button: "اختيار كلمة مرور جديدة",
    expires: "هذا الرابط صالح لمدة ساعة واحدة.",
    ignore: "إذا لم تطلب ذلك فتجاهل هذه الرسالة، وستبقى كلمة مرورك كما هي.",
  },
};

/** The language the reset was requested from: the first part of the redirect path ("/fr/reset-password"). */
function localeFromUrl(url: string): Locale {
  try {
    const callback = new URL(url).searchParams.get("callbackURL") ?? "";
    const first = decodeURIComponent(callback).split("/").filter(Boolean)[0];
    return isLocale(first) ? first : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

/** Sends the password reset link. Never throws: it must not slow down or break the request. */
export async function sendPasswordResetEmail(user: { email: string; name?: string | null }, url: string) {
  if (!emailConfigured()) {
    // Without email set up, show the link in the server log so you can test locally.
    if (process.env.NODE_ENV !== "production") console.warn(`[password reset] ${user.email}: ${url}`);
    return;
  }

  const locale = localeFromUrl(url);
  const c = copy[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  const html = `<div dir="${dir}" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
<h1 style="font-size:22px;margin:0 0 12px">${esc(c.title)}</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 20px">${esc(c.body)}</p>
<p style="margin:0 0 20px"><a href="${esc(url)}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:bold">${esc(c.button)}</a></p>
<p style="font-size:13px;color:#555;margin:0 0 6px">${esc(c.expires)}</p>
<p style="font-size:13px;color:#555;margin:0 0 24px">${esc(c.ignore)}</p>
<p style="font-size:12px;color:#888;border-top:1px solid #ddd;padding-top:14px">${esc(site.name)}</p>
</div>`;
  const text = `${c.title}\n\n${c.body}\n\n${url}\n\n${c.expires}\n${c.ignore}`;

  await sendEmail({ to: user.email, subject: c.subject, html, text }).catch((err) =>
    console.error("Could not send the password reset email", err),
  );
}
