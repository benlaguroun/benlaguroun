# Offline fallback (Cloudflare Worker)

When your Mac is off, asleep or the tunnel is down, visitors normally see Cloudflare's error 1033. This Worker sits in front of your site and makes that case look professional:

- Pages that visitors (and `deploy/warm.sh`) have loaded stay available as a saved copy: home, services, portfolio, projects, blog, about, legal pages, and the shop pages once the shop is open.
- Anything that has to run on the server (login, admin, checkout, dashboard, learn, the contact form, `/api`) shows a friendly "Back shortly" page, in English, French or Arabic, with your email address.
- It never saves pages for signed-in visitors, and it never fakes a login or a payment.

It is free (Cloudflare's free Workers plan allows 100,000 requests a day, including commercial sites). It is a stopgap, not a replacement for an always-on server: see section 1c in `LAUNCH.md`.

## Set it up (about 10 minutes, once)

1. Open the Cloudflare dashboard, then **Workers & Pages** -> **Create** -> **Create Worker**.
2. Name it `benlaguroun-fallback` and click **Deploy** (the sample code is fine for now).
3. Click **Edit code**, delete everything, paste the whole content of `deploy/worker/index.js`, and click **Deploy**.
4. Go to the Worker's **Settings** -> **Domains & Routes** -> **Add** -> **Route**. Add two routes, with your zone `benlaguroun.com`:
   - `benlaguroun.com/*`
   - `www.benlaguroun.com/*`
5. Go to **Settings** -> **Variables and Secrets** and add two text variables:
   - `CONTACT_EMAIL` = your real contact email (shown on the "Back shortly" page)
   - `SITE_NAME` = `Ben Laguroun`
6. Fill the copies. On your Mac, in the project folder:
   ```
   bash deploy/warm.sh
   ```
   It should end with "Warmed N pages and M files". `./deploy/deploy.sh` now runs it for you after every deploy.

## Test it

```
pm2 stop brand-web                                    # simulate the Mac being off
sleep 3
curl -s -D - -o /dev/null -H "Accept: text/html" https://benlaguroun.com/en | grep -i -E "^HTTP|x-served-from"
curl -s -H "Accept: text/html" https://benlaguroun.com/en/admin | head -c 400
pm2 start brand-web                                   # put the site back
```

With the app stopped you should see `HTTP/2 200` and `x-served-from: offline-copy` for the page, and the "Back shortly" page for `/en/admin`. Also open the site in a browser while the app is stopped and check that the page shows with its styles and images.

## What to know

- **Copies are kept per Cloudflare location.** `warm.sh` fills the location nearest to your Mac, which is also the one nearest to most of your visitors. A page that nobody in a location has loaded since the last deploy may not be saved there. Then they see the "Back shortly" page. Run `bash deploy/warm.sh` after you publish a post or project.
- **Copies expire** after 7 days (files after 30). Every deploy refreshes them.
- **Mid-session cut-off.** A visitor who is signed in and clicking around when the Mac goes off will see "Back shortly" for the account pages. That is intended.
- **The uptime monitor** on `/api/health` still reports "down" while the Mac is off, because that path is never faked. That is what you want.
- **Removing it:** delete the two routes in the Worker's settings. The site goes back to talking to the tunnel directly.
