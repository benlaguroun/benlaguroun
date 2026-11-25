# Launch checklist

The site is built. This list is what is left, in order. The first part you can do today without a company. The second part waits for the LLC.

## 1. Do now (no company needed)

- [ ] On your Mac: `npm run db:generate`, `npm run db:push`, `npm run typecheck`, `npm run build`.
- [ ] Set a real `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), in `.env.local` and on your server.
- [ ] In `apps/web/src/config/site.ts`: your real contact email, WhatsApp, LinkedIn and Facebook links.
- [ ] Brevo: an API key (starts with `xkeysib-`), a verified sender in `EMAIL_FROM`, and your domain authenticated (SPF, DKIM) so mail doesn't go to spam.
- [ ] Admin: hide the demo products, add your real products with real files, real testimonials, projects and your first blog posts.
- [ ] Buy and refund a test product in Stripe test mode and PayPal sandbox. Check the receipt, the download link, and that a refund removes access.
- [ ] Choose a host and a domain. Set `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to the real domain. Put the database and the `uploads` folder (it holds template files) on disks that are backed up.

## 2. When the LLC exists

- [ ] Fill in the `company` block in `config/site.ts`: legal name, entity type, where it is registered, registration number, registered address, tax number (optional), governing law. Then change `legal.updated` to today's date. The legal pages, footer, receipts and newsletter update by themselves.
- [ ] Have a lawyer read the privacy policy, terms and refund policy (`src/i18n/legal.ts`). They are a solid starting point, not legal advice. Ask especially about governing law, the refund window, and EU/UK consumer rules for digital goods.
- [ ] Open the business bank account, then create your Stripe and PayPal business accounts under the company's name.
- [ ] Stripe: live secret key, plus a webhook to `https://yourdomain.com/api/webhooks/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded`. Put `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on the server.
- [ ] PayPal: a Live app, `PAYPAL_ENV="live"`, client ID and secret, and a webhook to `https://yourdomain.com/api/webhooks/paypal` with its ID in `PAYPAL_WEBHOOK_ID`.
- [ ] Ask an accountant how sales tax / VAT applies to your digital sales. If you must collect it, tell me and I'll add it to checkout.
- [ ] Make one real purchase with your own card, check the receipt and download, then refund it from Admin → Payments.
- [ ] Check Admin → Errors is empty, and submit the sitemap (`/sitemap.xml`) in Google Search Console.

## Keys and secrets

Keep every key only in `.env.local` and in your host's environment settings. Never commit them to git and never paste them into chat.
