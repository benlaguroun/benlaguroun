# Brand Platform

One website that works as your portfolio, your services shop, your template store and your course platform. Built as a Turborepo with Next.js, TypeScript, Tailwind CSS v4, better-auth, Prisma and PostgreSQL.

## What is inside

The site has public pages for your brand (home, work, services, templates, courses, contact) and a members area (login, library, lesson player with progress tracking). Everything you sell lives in one `Product` table with a type of `SERVICE`, `TEMPLATE` or `COURSE`. Services end in an inquiry form that saves leads to the database. Templates and courses end in a checkout, and a successful payment creates an `Entitlement` that unlocks the download or the lessons.

```
apps/web          Next.js site (pages, API routes, components)
packages/db       Prisma schema, generated client, seed data
```

## Getting started

1. Start a PostgreSQL database and copy `.env.example` into `apps/web/.env.local` and `packages/db/.env`, filling in `DATABASE_URL` and `BETTER_AUTH_SECRET`.
2. Install and prepare the database:

   ```bash
   npm install
   npm run db:generate
   npm run db:push
   npm run db:seed
   npm run dev
   ```

3. Open http://localhost:3000. The seed loads sample services, templates, one course and three portfolio projects so you can see everything working. Replace them with your own.

To make yourself an admin, sign up on the site, then set `role = 'ADMIN'` on your row in the `user` table. Admins can open every course without buying it.

## Branding it

Edit `apps/web/src/config/site.ts` for your name, tagline, email, navigation and social links. Edit the colour and font tokens at the top of `apps/web/src/app/globals.css` to re-skin the whole site. The homepage copy lives in `apps/web/src/app/page.tsx`.

## Languages and design

The site speaks English, French and Arabic, and Arabic switches the whole layout to right-to-left. Every page lives under `/en`, `/fr` or `/ar`. Visitors without a prefix are redirected to their saved language, then their browser language, then English (see `src/proxy.ts`). The interface text lives in `src/i18n/dictionaries/{en,fr,ar}.ts`; add a key to `en.ts` first and TypeScript will then insist you add it to the other two.

Content from the database (products, lessons, projects) is translated through a `translations` JSON column on each row, for example `{ "fr": { "name": "...", "tagline": "..." }, "ar": { ... } }`. Any field you leave untranslated falls back to English. The seed file shows the shape. After changing the schema run `npm run db:push` again.

The look is a dark glassmorphism theme: an animated aurora background, glass cards with a spotlight and glowing border that follow the cursor, scroll-reveal animations, and an animated diagram of your local network on the homepage. Colours and fonts live at the top of `src/app/globals.css`; motion is switched off automatically for visitors who prefer reduced motion. Fonts (Space Grotesk, Inter, Cairo, JetBrains Mono) are loaded through `next/font/google`, so the first run needs internet access.

## Payments: Stripe and PayPal

**How a purchase works.** The buyer opens a template or course, presses Buy, signs in if needed, lands on `/checkout/<product>` (order summary, choice of payment method, Pay button), is sent to the provider's secure page, and comes back to a thank-you page with the course link or download. The price is always read from the database, never from the browser.

A payment method is offered as soon as its keys are in your environment, so you can run Stripe, PayPal or both (and Lemon Squeezy as a third) with no code changes. Set `PAYMENT_PROVIDERS="stripe,paypal"` if you want to limit the list. All webhooks call the same `fulfillOrder` function, which is safe to run twice.

**PayPal.** Create an app in the PayPal developer dashboard and set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` and `PAYPAL_ENV` (`sandbox` to test, `live` for real money). The buyer approves on paypal.com, returns to `/api/paypal/return`, and the site captures the payment and checks the amount before unlocking access. As a safety net, add a webhook to `/api/webhooks/paypal` for `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.REFUNDED` and `PAYMENT.CAPTURE.REVERSED`, and put its id in `PAYPAL_WEBHOOK_ID`. Orders must be in a currency PayPal supports (USD, EUR, GBP...).

**Stripe.** Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. Point a webhook at `/api/webhooks/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded`. Locally, `stripe listen --forward-to localhost:3000/api/webhooks/stripe` gives you the secret. You handle sales tax and VAT yourself.

**Lemon Squeezy.** It acts as merchant of record, so it collects and remits tax for you, at a higher fee. Set `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID` and `LEMONSQUEEZY_WEBHOOK_SECRET`. Create a variant for each product in their dashboard and paste its id into the product's `lemonVariantId`. Point a webhook at `/api/webhooks/lemonsqueezy` for `order_created` and `order_refunded`. The price is overridden per checkout so it always matches your catalog.

## Emails

Set `BREVO_API_KEY` and `EMAIL_FROM` (a sender you verified in Brevo) and the site sends: a receipt to every buyer in the language they bought in, a short "new sale" note to you, and a "new message" note to you for each contact-form message (replying to it answers the visitor). `ADMIN_NOTIFY_EMAIL` chooses where your notes go. Without these keys nothing is sent and everything else works as before. A receipt is sent once per order, even when both the return page and the webhook confirm it.

**PayPal and currencies.** PayPal can't charge every currency (Moroccan dirham, for example). When a product is priced in an unsupported currency, PayPal is simply not offered for it and the buyer sees the other methods.

## Adding your own products and lessons

There is no admin UI yet, so for now edit `packages/db/prisma/seed.ts` or use `npx prisma studio` from `packages/db`. For templates, set `deliveryUrl` to the file the buyer should receive (a private storage link works well). For course lessons, `videoUrl` takes an embed URL from YouTube, Vimeo, Bunny or Mux, and `isPreview` makes a lesson free to watch.

## Good next steps

An admin dashboard for products, lessons and leads; email notifications for new leads and purchases (Resend works well); signed, expiring download links for templates; email verification and password reset in better-auth; and caching for the public pages once the content is stable (they currently render on every request).
