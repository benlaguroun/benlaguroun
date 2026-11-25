# Service packages and the care plan

Your playbook for selling services to schools, clinics and hotels. The same packages are on the site (run `npm run db:services` once). This file holds what the site cannot: exclusions, payment schedules, rules, and the agreement you send before any work starts.

**Read this first.** The prices below are starting points, written from how this kind of work usually sells. They are not tested in your market. Treat the first three quotes as experiments: if everybody says yes immediately, you are too cheap; if nobody answers, test lower or narrow the scope. Change prices in Admin -> Products at any time. Two things need a professional, not me: how to invoice before the LLC exists (ask an accountant) and the final wording of the agreement (ask a lawyer to review it once).

---

## The ladder

| Package | Price (USD) | Time | Deposit | Who it is for |
|---|---|---|---|---|
| Starter Site | 1,500 | about 2 weeks | 50% | A school, clinic or hotel with no real website |
| Management Platform | from 7,500 (after a 600 Discovery Sprint, credited) | 8 to 12 weeks | 40% / 30% / 30% | Organisations running on paper, spreadsheets and WhatsApp |
| AI Assistant Setup | 1,800 | 2 to 4 weeks | 50% | One repetitive process (messages, reports, follow-ups) |
| Care Plan Essential | 150 / month | ongoing | monthly in advance | Everyone you build for |
| Care Plan Plus | 350 / month | ongoing | monthly in advance | Platforms that staff use every day |

How they fit together: the Starter Site is the easy first yes. The Discovery Sprint is the low-risk first step into a platform. Every project ends in a Care Plan, which turns one-off income into monthly income. That recurring income is what makes the business stable.

---

## 1. Starter Site (1,500 USD)

**Included**
- Up to 6 pages, in Arabic, French and English, with right-to-left done properly
- Contact form and WhatsApp button
- Search engine basics and visit statistics
- 2 rounds of changes
- Your own domain with HTTPS
- First month of hosting

**Not included** (price separately, or move to a Care Plan)
- Extra pages, extra languages, or copywriting and translation you did not supply
- Online payments, booking, user accounts or a blog
- Photography, logo design
- More than 2 rounds of changes

**Client provides:** text, photos and logo within 7 days of the deposit. The clock starts when the content arrives, not when the deposit does.

**Timeline:** about 2 weeks from content received.
**Payment:** 50% before work starts, 50% before launch. Launch happens after the second payment.

## 2. Management Platform (from 7,500 USD)

**Step 1, the Discovery Sprint (600 USD, paid in full up front).** Five working days. You interview staff, map how the organisation works today, and deliver a written scope, a fixed price and a timeline. If the client goes ahead, the 600 is deducted from the price. If not, they keep the scope document and owe nothing more. This protects you from unpaid free consulting and protects them from a surprise price.

**Step 2, the build.** The price is fixed once the scope is signed. 7,500 is the starting point for a focused platform (for example attendance and parent notifications, or reservations and guest records). Larger scope means a higher quote, never a vague "we'll see".

**Included:** staff accounts with roles, the records and workflows in the signed scope, payments and reports where in scope, three languages, training for the team, launch, hosting setup, 30 days of support.

**Not included:** anything not in the signed scope (that is a change request, see below), hardware (card readers, cameras, devices), data entry and migration beyond what the scope lists, third-party fees (SMS, WhatsApp, AI usage), and ongoing support after 30 days (that is the Care Plan).

**Timeline:** usually 8 to 12 weeks, in stages the client reviews and approves.
**Payment:** 40% at the start, 30% at the midpoint demo, 30% at launch.

**Change requests.** Anything outside the signed scope is written down, priced and approved before work begins. Small changes can be paid from Care Plan hours.

## 3. AI Assistant Setup (1,800 USD)

**Included:** an audit of one process, one assistant built on the tools the client already uses, clear rules, an activity log, an approval step for sensitive actions, a team walkthrough and 30 days of support.

**Not included:** a second process (a second package), fully unsupervised sending (agree it later, in writing), and the AI service fees themselves. The client pays the AI provider directly at cost, which is usually small for one process.

**Honest limits to say out loud:** the assistant drafts and a person approves. It will occasionally be wrong. That is why the approval step exists. WhatsApp automation depends on the WhatsApp Business rules, so confirm what is allowed before promising it.

**Timeline:** 2 to 4 weeks. **Payment:** 50% to start, 50% when it works.

## 4. Care Plan

| | Essential (150 / month) | Plus (350 / month) |
|---|---|---|
| Hosting and daily backups | yes | yes |
| Uptime monitoring and alerts | yes | yes |
| Security and software updates | yes | yes |
| Fixes for anything that breaks | yes | yes |
| Changes per month | 2 hours | 6 hours |
| Response time | 2 working days | 1 working day |
| Monthly report | no | yes |

**Rules that keep it fair and sustainable**
- Billed monthly in advance, by bank transfer. Yearly in advance gets one month free.
- Unused hours do not roll over (otherwise they pile up into a liability).
- Minimum 3 months, then 30 days' notice to stop. The client always keeps their data and code.
- Work beyond the monthly hours is quoted per hour or as a small fixed price, agreed first.
- No promise of 100% uptime. Promise monitoring, a fast response and honest reporting. If you host on your own machine, be clear in your own head that one machine is a single point of failure. Before you sign a client who depends on the system every day, move their hosting to a proper server (see ROADMAP.md, Part A).
- Late payment: after 14 days, service is paused until the invoice is paid, after a written reminder.

---

## Rules for every project

1. **No work before the deposit and the signed agreement.** No exceptions, including for friends and "easy" jobs.
2. **A written scope is the contract.** If it is not in the scope, it is a change request.
3. **Fixed price, fixed scope.** Never hourly for the build. If the client keeps changing their mind, that is what change requests are for.
4. **The client owns their content.** You keep ownership of your reusable code and tools, and give the client a licence to use what you built for them. Say this in the agreement so nobody is surprised later.
5. **Hand over credentials.** Domain and accounts are registered in the client's name, with you as an admin.
6. **Say what you do with data.** Schools and clinics hold personal data about children and patients. Write down where it is stored, who can see it, and how it is backed up. Check what the law in the client's country requires (in Morocco, data protection rules apply to this kind of data). Have a lawyer confirm this before your first clinic or school signs.
7. **Close every project with a Care Plan offer** at the handover meeting, not by email afterwards.

---

## Agreement template (one page, send before any work starts)

> Have a lawyer review this once. Then reuse it. Fill the brackets.

**Service Agreement**

**Between** [your legal name or business name, address] ("the Provider") **and** [client legal name, address] ("the Client"). Date: [date].

**1. Services.** The Provider will deliver [package name] as described in the attached Scope (Schedule A). Anything not in the Scope is not included.

**2. Price and payment.** The total price is [amount and currency]. Payment is [schedule, for example 50% before work starts, 50% before launch], by bank transfer, within [7] days of each invoice. Work starts when the first payment and the signed Scope are received. Launch happens after the final payment.

**3. Timeline.** The estimated delivery is [weeks] from the later of the first payment and the Client supplying the content listed in Schedule A. Delays caused by late content or late feedback move the dates by the same amount.

**4. Changes.** Changes outside the Scope are agreed in writing with a price and a date before they start.

**5. Client responsibilities.** The Client provides content, access and feedback on time, and confirms it has the right to use all content it supplies.

**6. Ownership.** The Client owns the content it supplies and the finished site or system once paid in full. The Provider keeps ownership of its pre-existing and reusable code and tools, and grants the Client a permanent licence to use them as part of what was delivered.

**7. Data.** The Provider will only use the Client's data to deliver and support the services, and will keep it secure. Personal data of students, patients or guests stays under the Client's control. [Add the storage location and the backup arrangement.]

**8. Support and hosting.** [30 days of support included. After that, hosting and support are provided under the Care Plan, or the Client may host elsewhere, and the Provider will hand over everything needed.]

**9. Cancellation.** If the Client cancels, payments already made for work done are not refundable, and the Client owes payment for work completed up to that date. If the Provider cannot deliver, the Provider refunds the part not yet delivered.

**10. Liability.** The Provider is not liable for indirect or consequential loss. Total liability is limited to the amount paid under this agreement. [Have this wording checked locally.]

**11. Law.** This agreement is governed by [the law of your country or the LLC's jurisdiction], and disputes go to [the courts of ...].

Signed for the Provider: ________  Signed for the Client: ________

**Schedule A, Scope.** Pages or modules: [list]. Languages: [list]. Client supplies: [list and deadline]. Excluded: [list]. Delivery: [date].

---

## Your first week with this

1. Run `npm run db:services` and look at the four packages on `/services`. Adjust any price you disagree with.
2. Put the agreement template into a document, and book one hour with a lawyer to review it.
3. Ask an accountant how to invoice before the LLC exists (or whether to wait for it for the larger projects).
4. Make a one-page PDF of the ladder table above to send to prospects.
5. Contact 10 schools, clinics or hotels you already know. Offer the Starter Site or a Discovery Sprint. Ten conversations will teach you more about the right price than any guess in this file.
6. When you have a signed first client, tick "Write the service packages and the care plan" in Admin -> Roadmap.
