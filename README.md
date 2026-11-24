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

## Payments: Stripe or Lemon Squeezy

Set `PAYMENT_PROVIDER` to `stripe` or `lemonsqueezy` and no code changes are needed. Both implement the interface in `src/lib/payments/types.ts`, and both webhooks call the same `fulfillOrder` function, which is safe to run twice.

**Stripe.** Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. Point a webhook at `/api/webhooks/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded`. Locally, `stripe listen --forward-to localhost:3000/api/webhooks/stripe` gives you the secret. You handle sales tax and VAT yourself.

**Lemon Squeezy.** It acts as merchant of record, so it collects and remits tax for you, at a higher fee. Set `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID` and `LEMONSQUEEZY_WEBHOOK_SECRET`. Create a variant for each product in their dashboard and paste its id into the product's `lemonVariantId`. Point a webhook at `/api/webhooks/lemonsqueezy` for `order_created` and `order_refunded`. The price is overridden per checkout so it always matches your catalog.

## Adding your own products and lessons

There is no admin UI yet, so for now edit `packages/db/prisma/seed.ts` or use `npx prisma studio` from `packages/db`. For templates, set `deliveryUrl` to the file the buyer should receive (a private storage link works well). For course lessons, `videoUrl` takes an embed URL from YouTube, Vimeo, Bunny or Mux, and `isPreview` makes a lesson free to watch.

## Good next steps

An admin dashboard for products, lessons and leads; email notifications for new leads and purchases (Resend works well); signed, expiring download links for templates; email verification and password reset in better-auth; and caching for the public pages once the content is stable (they currently render on every request).
