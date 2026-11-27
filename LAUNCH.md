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

## 1b. Put the site on your own domain

This is the step that makes links in emails, the sitemap and sign-in work for real visitors. The steps below assume you host on your own machine, which is how you run your other platforms. A tunnel gives you HTTPS without opening any ports on your router.

- [ ] **Get the domain.** Cloudflare Registrar sells domains such as benlaguroun.com at cost and puts the DNS in Cloudflare for you. Namecheap or any registrar also works: then add the domain to a free Cloudflare account and change the nameservers at the registrar to the two Cloudflare gives you.
- [ ] **Connect it to your machine with a Cloudflare Tunnel.** On the machine that runs the site: `brew install cloudflared`, then `cloudflared tunnel login`, `cloudflared tunnel create brand`, and `cloudflared tunnel route dns brand yourdomain.com`. In `~/.cloudflared/config.yml` point the tunnel at the site: `ingress: - hostname: yourdomain.com  service: http://localhost:3000` and a final `- service: http_status:404`. Start it with `cloudflared tunnel run brand` (and install it as a service so it survives reboots). The rate limiter already reads Cloudflare's visitor address.
- [ ] **Set both addresses to the same value.** For benlaguroun.com they are already in `apps/web/.env.production.local` (read only by the production build, so `npm run dev` stays on localhost; the file is git-ignored). They must be identical, with `https://` and no trailing slash: `NEXT_PUBLIC_APP_URL="https://benlaguroun.com"` and `BETTER_AUTH_URL="https://benlaguroun.com"`. The other settings (database, secrets, Brevo and the AI keys) still come from `.env.local`. Use a different `BETTER_AUTH_SECRET` and database for the live site than for development if you can.
- [ ] **Keep it running.** `npm install -g pm2`, then `./deploy/deploy.sh` builds and starts the site, and `pm2 startup` makes it start at boot. `deploy/cloudflared.example.yml` has the tunnel settings for benlaguroun.com. Later updates are the same one command: `./deploy/deploy.sh`.
- [ ] **Rebuild, then start.** `deploy.sh` does this for you. By hand it is `npm run build` and `npm run start`. `NEXT_PUBLIC_APP_URL` is baked into the build, so changing it later without rebuilding changes nothing.
- [ ] **Pick one address.** In Cloudflare add a redirect rule from `www.yourdomain.com` to `yourdomain.com` (or the other way round), so search engines see one site. Sign-in already works on both.
- [ ] **Email from your domain.** In Brevo add and verify the domain (it gives you SPF and DKIM records to add in Cloudflare DNS), then set `EMAIL_FROM="hello@yourdomain.com"` and your real `email` in `config/site.ts`. Mail from a Gmail address often lands in spam.
- [ ] **Run the Live check.** Open Admin → Live check on the live site. It tests the public address, the sitemap, the www address, the database, email and payments, and tells you the fix for anything marked Problem. Run it after every deploy. Then add a free uptime monitor (UptimeRobot or Better Stack) on `https://benlaguroun.com/api/health` every 5 minutes, so you get an email if the site or tunnel goes down.
- [ ] **Check it works.** Open `https://yourdomain.com/sitemap.xml` and `/robots.txt` (they should show your domain, not localhost). Create a test account and check that the verification email's link opens your domain. In Admin → Roadmap the domain step ticks by itself, and the server logs no "[setup]" warning at start.
- [ ] Later, when you add payments, your webhooks are `https://yourdomain.com/api/webhooks/stripe` and `/api/webhooks/paypal`.

## 1c. Where it runs, and when to move

**Now: your Mac, behind a Cloudflare Tunnel, with the database on Neon.** This is enough for a live portfolio, blog, services and contact page. The shop (templates and courses) is closed on purpose: `shop.open` in `apps/web/src/config/site.ts` is `false`, so the menu, home page, sitemap and dashboard hide them and their pages return "not found". Open it when the company and payments are ready (see section 2): set it to `true` and deploy.

**Keep the Mac reliable.** Never sleep while plugged in, `pm2 startup` + `pm2 save` done, `cloudflared` installed as a service (config in `/etc/cloudflared/`), and a free uptime monitor on `/api/health`.

**Your catalog.** `npm run db:catalog` adds 12 templates and 6 courses as "Coming soon" products (visible with an email sign-up, impossible to buy). When you finish one, open it in Admin -> Products, upload the file or add the lessons, untick "Coming soon", and save. Admin -> Subscribers shows which product each person asked about, so build the ones with the most sign-ups first.

**Look professional while the Mac is off.** Add the Cloudflare Worker in `deploy/worker/` (guide in its README, about 10 minutes, free). Saved copies of public pages stay readable, and everything else shows a friendly "Back shortly" page instead of Cloudflare's error 1033. `./deploy/deploy.sh` refreshes the copies after each deploy.

**Move before you take a client who depends on it every day, or before you open the shop and sell. Two options:**

| | VPS (5 to 10 USD a month) | Vercel Pro (20 USD a month) |
|---|---|---|
| Fits your agency model (many client apps on one server) | yes | no, per project |
| Server work | you (updates, backups) | none |
| Uploaded files | copy the `uploads` folder | need object storage first (R2, S3) |
| Deploy | same `deploy.sh`, pm2, tunnel | push to GitHub |

Vercel's free Hobby plan is for non-commercial use only, so a site that sells needs Pro.

**What makes a move easy.** The code is on GitHub, the data is in Neon, every setting is an environment variable, and the domain is on Cloudflare. A move is: set the same variables on the new host, deploy, test on a temporary address, then repoint the DNS record. Nothing in the database changes.

**Known dependency on the machine: uploaded files.** Project and blog images (`/api/uploads`) and the paid downloads (`/api/uploads/private`) are saved on disk in `UPLOAD_DIR` (default `apps/web/uploads`). Back this folder up and copy it when you move. On Vercel, switch these routes to object storage first, because its servers do not keep files. Do this before you sell templates.

## 2. When the LLC exists

- [ ] Fill in the `company` block in `config/site.ts`: legal name, entity type, where it is registered, registration number, registered address, tax number (optional), governing law. Then change `legal.updated` to today's date. The legal pages, footer, receipts and newsletter update by themselves.
- [ ] Have a lawyer read the privacy policy, terms and refund policy (`src/i18n/legal.ts`). They are a solid starting point, not legal advice. Ask especially about governing law, the refund window, and EU/UK consumer rules for digital goods.
- [ ] Open the business bank account, then create your Stripe and PayPal business accounts under the company's name.
- [ ] Stripe: live secret key, plus a webhook to `https://yourdomain.com/api/webhooks/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded`. Put `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on the server.
- [ ] PayPal: a Live app, `PAYPAL_ENV="live"`, client ID and secret, and a webhook to `https://yourdomain.com/api/webhooks/paypal` with its ID in `PAYPAL_WEBHOOK_ID`.
- [ ] Ask an accountant how sales tax / VAT applies to your digital sales. If you must collect it, tell me and I'll add it to checkout.
- [ ] Open the shop: set `shop.open` to `true` in `config/site.ts` and deploy. Templates and courses then appear in the menu, home page and sitemap. Until a payment method has its keys, their pages show "Coming soon" with an email form (sign-ups land in Admin -> Subscribers, source `launch:<product>`); the buy buttons appear by themselves once Stripe or PayPal is set.
- [ ] Make one real purchase with your own card, check the receipt and download, then refund it from Admin → Payments.
- [ ] Check Admin → Errors is empty, and submit the sitemap (`/sitemap.xml`) in Google Search Console.

## Keys and secrets

Keep every key only in `.env.local` and in your host's environment settings. Never commit them to git and never paste them into chat.
