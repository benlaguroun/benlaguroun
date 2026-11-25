# Roadmap: from finished platform to paying customers

Written 25 November 2026, after a full review of the codebase. It has two halves. Part A is an honest audit of what the platform can and cannot do today. Part B is the plan for selling services, templates and courses as a software engineer, in the order that gets money in fastest. `LAUNCH.md` is the technical go-live checklist; this file is the bigger picture around it. **Admin → Roadmap** tracks every step below: steps the site can check by itself tick automatically, and the rest you tick by hand. The steps live in `apps/web/src/lib/roadmap.ts`.

---

## Part A. Where the project stands

### What is done and solid

The platform already does everything a small digital business needs. A visitor can read a trilingual (English, French, Arabic with right-to-left layout) site, see services, templates, courses, a portfolio and a blog, send a contact message, and subscribe to a newsletter. A customer can create an account, confirm their email, pay with Stripe or PayPal, receive a receipt with a signed download link, and open a lifetime course library with lesson progress. You, as the owner, have an admin area for products, curriculum and lessons, posts, projects, testimonials, clients, messages, subscribers, payments (with refund and resend-receipt buttons), analytics, and an error log that emails you when something breaks. Template files are stored privately and served only to people who bought them. Public pages are cached for speed, and the legal pages are written for a company and fill themselves from one config block.

### What is missing or weak (be honest about these)

1. **No automated tests and no CI.** The money path (checkout, webhooks, refunds, entitlements, download checks) has never been run by a machine on every change. One bad edit could silently stop receipts or give away a paid file. This is the biggest technical risk.
2. **No deployment definition.** There is no Dockerfile, no process manager config and no deploy script, so every deploy is a manual set of steps that lives in your head.
3. **No security headers.** The app hides the framework header but sets no Content-Security-Policy, X-Frame-Options, Referrer-Policy or HSTS. Cheap to add, and some buyers' security scanners look for them.
4. **No social preview images.** Pages have metadata but no per-page Open Graph images. When someone shares a template or blog post on LinkedIn or WhatsApp it will look bare, and sharing is how a personal brand grows.
5. **Course video is only a YouTube or Vimeo embed.** An unlisted YouTube link can be copied and shared by any buyer, which defeats a paid course. You need a host that restricts playback to your domain.
6. **No way to book a service.** The only path into a service sale is a contact form. Many serious clients prefer to pick a time on a calendar.
7. **No coupons, bundles or affiliate links.** You cannot run a launch discount, sell three templates as a pack, or let others promote you for a commission.
8. **No reviews or certificates.** Testimonials are admin-entered; buyers cannot leave a review, and course finishers get no certificate, which is a free marketing tool.
9. **Demo content.** The seed has sample products, and the contact email is still `hello@example.com`. LinkedIn and Facebook links are empty.
10. **Sales tax and VAT are not computed.** The legal text says tax is added "where we are required to collect it", but checkout does not do that yet. Whether you must is an accountant's question, but the code needs a path ready (Stripe Tax is the usual one).
11. **Single-server risk.** Database and uploaded files live on one machine. If the disk dies, the paid templates and the customer list die with it.

---

## Part B. The business plan

### The one idea to build everything around

Do not run three separate shops. Run **one ladder** where each rung feeds the next:

- **Free content** (blog posts, short videos, a free template) earns attention and email addresses.
- **Templates** (low price, instant, no support) turn followers into buyers and prove you are credible.
- **Courses** (mid price, built once, sold forever) turn buyers into students.
- **Services** (high price, your time) are bought by the people who trust you most.

Templates and courses make money while you sleep and fund your freedom; services make the most money per hour and are the quickest way to your first real income. So the order of work is not the order of the ladder. **Sell services first for cash, build templates alongside for credibility, and build the course last from questions your clients and buyers keep asking.**

### Who you sell to (pick one, say it everywhere)

Your site currently speaks to everyone, which converts no one. Your real edge, from your own work, is: *full-stack platforms with AI automation, multi-tenant systems, and self-hosting, delivered in three languages for Arabic, French and English markets.* Choose **one** audience for the next six months. Two good candidates:

- **Small businesses and agencies in Morocco, the Gulf and French-speaking Africa** who need a real platform (bookings, schools, clinics, stores) and cannot find an engineer who works natively in Arabic and French. Your own projects (school platform, hospitality, clinical) are proof.
- **Founders and agencies abroad** who want a senior engineer for a fixed-scope MVP or an AI automation project.

The first is easier to reach and faster to close; the second pays more. You can serve both, but write the homepage for one. Say it in one sentence at the top of the site, for example: "I build and host custom business platforms with AI built in, in Arabic, French and English." Everything else on the site should support that sentence.

### Services: sell packages, not hours

Hourly rates cap your income and invite haggling. Sell **fixed-scope, fixed-price packages** with a clear outcome, a timeline and a deposit. The catalog already has three slots (launch site, custom platform, AI automation); sharpen them like this:

| Package | What the buyer gets | How to sell it |
|---|---|---|
| **Launch site** | A fast, multilingual business site, delivered in about two weeks | Entry product. Low risk for the buyer. Quote a fixed price. |
| **Custom platform** | Auth, admin, payments, dashboards, built to the client's process | Offer a paid **discovery** step first (a few days, paid, produces a written spec). It filters out time-wasters and funds your planning. |
| **AI automation** | One painful process automated end to end | Price against the money or hours it saves the client, not against your hours. |
| **Hosting and care plan** | Hosting, updates, backups and fixes for a monthly fee | This is your recurring income. You already host on your own hardware: turn it into a named monthly plan and attach it to every project. |

Starting price ranges are not something I can verify for your market, so treat any number as a first guess and test it: start higher than feels comfortable, take 30 to 50 percent upfront, and raise prices after every three sales. Always write a one-page scope and sign it before starting. The refund policy already says services follow the written agreement, so the agreement must exist.

Where the clients come from, in order of speed: (1) people you already know, ask directly; (2) your existing finished projects, offer past clients a care plan; (3) LinkedIn and Facebook groups where your audience asks for help, answer questions genuinely for two weeks, then offer a call; (4) a Google Business profile and local search if you target Morocco; (5) later, referrals and content.

### Templates: small, sharp, and tied to your real work

Templates sell when they save a specific person a specific week. Do **not** make generic templates; the market is full of them. Package pieces of work you have already done and can show running:

- **SaaS starter** (your Turborepo, auth, billing, admin foundation). Your strongest asset, because you have built it many times.
- **Multi-tenant starter** or **admin dashboard kit**.
- **Arabic and RTL-ready** versions of common pieces. Almost nobody sells these well, and you already have the i18n and RTL work done.
- **Business documents** (Notion packs, proposals, contracts) for the course audience.

For each one: a live demo, a short video, screenshots, a clear "what is included" list, a changelog, and a visible license (the terms already say use in unlimited projects, no resale). Support is the hidden cost of templates, so limit it in writing: a documented setup, updates for a year, no custom help. Sell a **starter at a low price** and a **pro version or bundle** at a higher one. Add one free template to collect emails. Aim for three strong templates, not ten weak ones.

### Courses: build one, make it a flagship

A course is a months-long project, so protect your time:

1. **Validate before recording.** Run a free live workshop or a five-day email mini-course on the topic. If a few dozen people attend and ask for more, build it. If not, you saved months.
2. **Pre-sell.** Open a founders' price for the first cohort before the lessons exist, deliver in modules, and use the early feedback to fix the rest. The platform's progress tracking will show you where students get stuck.
3. **Pick a narrow promise** a beginner can finish: for instance, "Build and launch a multilingual business site with Next.js." Narrow beats broad. Your seed course (start with a clear offer) is a decent business course; a technical course is a better match for your credibility.
4. **Protect the videos** with a host that restricts playback by domain (see Phase 2).
5. **Add a certificate and a private community** (a Telegram or Discord group) so the course feels alive and students tell others.

### The email list is the real asset

Every visitor who leaves without buying is gone unless you have their email. Put the newsletter signup where people are about to leave, offer one genuinely useful free download in return, and send a short email every week or two with something you built or learned. When you launch a template or course, your list buys first and fastest. Social followers can disappear; the list is yours.

### Trust, which decides every sale

Strangers buy from people who look real. Put your face and your story on the About page, show 3 to 6 real projects with the problem, what you built and the result, collect testimonials (a short video from one client beats ten text quotes), publish the legal pages with your company name and address, and answer every message within a day. A fast reply is a competitive advantage most freelancers do not use.

---

## Part C. The sequence

Dates assume you start now and work on this part-time; shift them as needed.

### Phase 0. Make it real (this week)

- [ ] Run `npm run db:generate`, `db:push`, `typecheck`, `build` on your Mac.
- [ ] Set your real email, WhatsApp, LinkedIn and Facebook in `config/site.ts`.
- [ ] Hide the demo products and add one real template and one real service with real descriptions.
- [ ] Rewrite the homepage headline for your chosen audience.
- [ ] Choose a domain and a host; set `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL`.
- [ ] Start the LLC paperwork. Everything in `LAUNCH.md` part 2 waits on this.

### Phase 1. First income from services (weeks 1 to 4)

You can take PayPal-free bank transfers or invoices for services before Stripe exists, so do not wait for the company to sell.

- [ ] Write the three service packages plus the care plan, each with scope, price, timeline, deposit.
- [ ] Add a booking link (Calendly or Cal.com) to the contact page and service pages.
- [ ] Show 3 real projects in the portfolio with results.
- [ ] Contact 20 people directly. Aim for 3 calls and 1 paying client.
- [ ] Ask each finished client for a testimonial and a referral.

### Phase 2. Make it safe to take money (weeks 2 to 6, alongside Phase 1)

This is the technical work I recommend next, in priority order:

1. **Automated tests for the money path** (checkout, webhooks, refunds, entitlement checks, download authorization) plus a CI workflow that runs typecheck, lint and tests on every push.
2. **Security headers** (CSP, frame, referrer, HSTS) in `next.config.ts`.
3. **Deployment as code**: a Dockerfile and a compose file for the app and database, and a one-command deploy.
4. **Backups**: a nightly database dump and a copy of `uploads` and `uploads/private` to storage off the machine, and a tested restore.
5. **Protected course video** with a host that restricts playback to your domain (Bunny Stream, Mux, or Vimeo with domain-level privacy).
6. **Stripe Tax or a tax path**, once your accountant says you must collect.

### Phase 3. Templates (weeks 4 to 10)

- [ ] Finish and package the first template from real work, with demo, video and docs.
- [ ] Add a free template behind the newsletter signup.
- [ ] Add Open Graph preview images so shares look professional.
- [ ] Launch to your list and in three communities where your buyers are. Write about how you built it rather than just advertising it.
- [ ] Add **coupons and bundles** (a small schema addition plus checkout support) before the second template, so you can run a launch discount.

### Phase 4. Content that brings people in (ongoing from week 3)

Publish one useful post or short video every week for a quarter, aimed at your chosen audience, in the languages they read. Good topics are things you actually did: "How I built attendance with Hikvision cards", "Self-hosting a client platform for almost nothing", "Why I use one Turborepo for everything". Each post links to a template or service. Reuse each piece as a LinkedIn post and a short clip. Consistency matters more than polish.

### Phase 5. The course (months 3 to 6)

Validate with a free workshop, pre-sell a first cohort, record in modules, add a certificate and community, then open it to your list. Treat the first cohort as paid feedback.

### Phase 5b. The AI assistant (after the money path is tested)

An assistant that triages and drafts replies, with every action visible in the admin and every decision waiting for your approval, is a strong idea: it saves time, and an "AI automation" service you can show running on your own site is the best proof of that service. Build it in this order, and keep the safety rules from the start:

1. **Activity log and approval queue first.** Every run records what came in, what the assistant decided, which tools it used, what it cost, and shows Approve, Edit or Reject.
2. **Triage** (label each message: sales lead, support, refund, spam, partnership). Read-only.
3. **Drafted replies** from your services, prices and policies. You approve before anything is sent.
4. **Follow-up reminders** for leads you have not answered, and a **daily digest**.
5. **Autonomy by category, earned.** Let a category send by itself only after its drafts are nearly always approved unchanged. Refunds, quotes, contracts and prices never go automatic.

Rules that do not bend: messages from the contact form are untrusted text, so the assistant treats them as data and never as instructions; it never holds permission to refund, charge or delete; there is a kill switch and a daily spend limit; and the privacy policy names the AI provider as a processor.

### Phase 6. Compound (month 6 onward)

- Reviews from verified buyers on product pages.
- An affiliate program for people with audiences.
- Care plans as steady monthly income, and a "productized" version of your best service.
- Raise prices when demand is steady. Retire what does not sell.

---

## What to measure

Check these monthly in Admin → Analytics and Payments; they tell you which rung of the ladder is weak.

- **Visitors to email signups** (is the free offer good?).
- **Product page visits to checkouts to paid orders** (is the page, price or trust the problem?).
- **Refund rate** (above a few percent means the product or its description is misleading).
- **Course completion** from lesson progress (low means the lessons are too long or too hard).
- **Service calls booked to clients signed** (is the offer, price or follow-up weak?).
- **Monthly recurring income** from care plans (the number that makes the business calm).

## Three rules to keep

1. **Narrow beats broad.** One audience, one promise, one flagship product at a time.
2. **Ship small, sell early.** A rough template with real buyers teaches more than a perfect one that nobody has seen.
3. **Own the relationship.** Collect emails, answer fast, and keep every customer's results visible. Trust is the product you are really selling.
