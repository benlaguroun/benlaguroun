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

## Managing content in the admin

Sign in as an admin and use the side menu:

- **Products** creates and edits services, templates and courses: text, price, bullet points, cover image, French and Arabic versions, published/featured, and (for templates) the file buyers download and the live preview link. A course has a **Curriculum** page for modules and lessons: add, edit, reorder, mark free previews, and paste a YouTube or Vimeo link (it becomes an embed automatically). A product that has been bought can't be deleted, only unpublished, so your sales history stays intact.
- **Testimonials** holds real client quotes. The home-page section stays hidden until one is published.
- **Analytics** shows visits, top pages, where visitors come from, countries, devices and how many checkout visits became sales. It is counted by your own server: no cookies, no IP addresses stored, bots and your own browser left out, and views older than about 13 months are deleted. Country appears when the site runs behind Cloudflare.
- **Errors** lists problems the site ran into (a payment that could not be confirmed, a webhook that failed, a page that crashed). The same problem appears once with a counter, and you get an email at most once an hour per problem when Brevo is set up. Long key-like strings are removed before anything is stored. Mark errors resolved once handled; they reopen if they happen again.
- **Refunds and receipts** are on the Payments page for store sales. *Refund* sends the full amount back through Stripe or PayPal and removes the buyer's access (Lemon Squeezy orders only lose access, so return that money from its dashboard). It asks you to confirm first and is safe to repeat. *Resend receipt* emails the buyer their receipt again without notifying you a second time.
- **Projects**, **Blog** and **Testimonials** are editors for your portfolio (cover, screenshots, demo link), articles and client quotes. Images you upload are saved in `apps/web/uploads` (or `UPLOAD_DIR`), so back that folder up.
- **Template downloads.** Upload the template as a ZIP or PDF (up to 100 MB) on the product page. It is stored in a private folder, never at a public address. Buyers download it from the thank-you page, their library or the product page, and the server checks they own it every time (at most 20 downloads an hour each). Their receipt email carries a signed link that works without signing in for 7 days; after that they sign in. A refund cancels access and old links straight away. If you paste an external link instead, it is only revealed after the same checks, but once someone has seen it you cannot take it back. Behind Cloudflare's free plan uploads are capped at 100 MB.
- **Email confirmation.** New accounts get a confirmation email (English, French or Arabic, valid 24 hours). Logging in is never blocked, but paying needs a confirmed address, so receipts and download links reach the real owner. Buyers who haven't confirmed see a notice on the checkout page and in their library with a button to send the link again. It only applies once Brevo is set up (otherwise nobody could confirm), and never to the admin account. In development without Brevo, the link is printed in the server log. Existing accounts are unconfirmed, so they confirm once, on their next purchase.
- **Speed.** The home page, services, blog, portfolio and the template and course lists are built once and reused for 10 minutes, so visitors get them without a database query. Anything you save in the admin refreshes them immediately. Pages that depend on the visitor (product pages with the "you own this" button, checkout, library, lessons, contact) are still built on every visit. `npm run build` needs the database reachable, because it builds the cached pages up front.
- **Subscribers** lists newsletter sign-ups and downloads the active ones as a CSV to import into Brevo or any newsletter tool.

`npm run db:seed` only adds missing sample content and never changes a product, course or lesson that already exists, so it is safe to run after you start editing.

## Legal pages and the newsletter

The privacy policy, terms of sale and refund policy live at `/privacy`, `/terms` and `/refunds` in all three languages. The text is in `apps/web/src/i18n/legal.ts`; the country, refund window and "last updated" date are in `apps/web/src/config/site.ts` (`legal`). They are a solid starting point written for how this site works, not legal advice, so have a lawyer read them, and change the date whenever you edit the text. Checkout links to the terms and refund policy.

The footer has a newsletter form. New subscribers get a welcome email (when Brevo is set up) with an unsubscribe link, and unsubscribing takes one confirmed click. The site stores the list; you send the actual newsletters from your email tool.

## Good next steps

Nothing essential is left. If traffic grows: move the in-memory rate limiter to Redis, and split the template and course product pages so their "you own this" button loads separately and the pages can be cached too.
