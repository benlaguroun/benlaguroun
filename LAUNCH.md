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
