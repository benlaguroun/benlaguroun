"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { assertAdmin } from "@/lib/admin";
import { parseAmount } from "@/lib/admin-format";
import { defaultLocale, isLocale, lp } from "@/i18n/config";
import { safeNext } from "@/lib/session";

// Every action starts with assertAdmin(): the form may have been rendered for an
// admin, but the request itself is checked again on the server.

const LEAD_STATUSES = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;
const CLIENT_STATUSES = ["PROSPECT", "ACTIVE", "PAST"] as const;
const PAYMENT_STATUSES = ["PENDING", "PAID", "REFUNDED"] as const;
const METHODS = ["BANK_TRANSFER", "CASH", "CARD", "ONLINE", "OTHER"] as const;

function str(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}
function optional(fd: FormData, key: string) {
  return str(fd, key) || null;
}
function pick<T extends readonly string[]>(value: string, allowed: T, fallback: T[number]): T[number] {
  return (allowed as readonly string[]).includes(value) ? (value as T[number]) : fallback;
}
function localeOf(fd: FormData) {
  const l = str(fd, "locale");
  return isLocale(l) ? l : defaultLocale;
}
function returnTo(fd: FormData, fallback: string) {
  return safeNext(str(fd, "returnTo"), fallback);
}
/** Send the admin back to a form with an error message shown above it. */
function fail(path: string, message: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`);
}
function refresh() {
  revalidatePath("/", "layout");
}

/** Link a client to the website account with the same email, if there is one. */
async function findUserIdForEmail(email: string | null) {
  if (!email) return null;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, select: { id: true } });
  if (!user) return null;
  const taken = await prisma.client.findUnique({ where: { userId: user.id }, select: { id: true } });
  return taken ? null : user.id;
}

// ---------------------------------------------------------------- messages

export async function setLeadStatus(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id");
  const status = pick(str(fd, "status"), LEAD_STATUSES, "READ");
  await prisma.lead.update({ where: { id }, data: { status } });
  refresh();
  redirect(returnTo(fd, lp(localeOf(fd), "/admin/messages")));
}

export async function deleteLead(fd: FormData) {
  await assertAdmin();
  await prisma.lead.delete({ where: { id: str(fd, "id") } });
  refresh();
  redirect(lp(localeOf(fd), "/admin/messages"));
}

export async function convertLeadToClient(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const lead = await prisma.lead.findUnique({ where: { id: str(fd, "id") } });
  if (!lead) redirect(lp(locale, "/admin/messages"));

  const email = lead.email.toLowerCase();
  let client = await prisma.client.findUnique({ where: { email } });

  if (!client) {
    const details = [
      lead.interest ? `Interested in: ${lead.interest}` : null,
      lead.budget ? `Budget: ${lead.budget}` : null,
    ].filter(Boolean);
    client = await prisma.client.create({
      data: {
        name: lead.name,
        email,
        source: "Contact form",
        status: "PROSPECT",
        notes: details.length ? details.join("\n") : null,
        userId: await findUserIdForEmail(email),
      },
    });
  }

  await prisma.lead.update({
    where: { id: lead.id },
    data: { clientId: client.id, status: lead.status === "NEW" ? "READ" : lead.status },
  });
  refresh();
  redirect(lp(locale, `/admin/clients/${client.id}`));
}

// ----------------------------------------------------------------- clients

export async function createClient(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const here = lp(locale, "/admin/clients/new");

  const name = str(fd, "name");
  const email = optional(fd, "email")?.toLowerCase() ?? null;
  if (!name) fail(here, "Please enter the client's name.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(here, "That email address doesn't look right.");
  if (email && (await prisma.client.findUnique({ where: { email } }))) {
    fail(here, "A client with that email already exists.");
  }

  const client = await prisma.client.create({
    data: {
      name,
      email,
      phone: optional(fd, "phone"),
      company: optional(fd, "company"),
      source: optional(fd, "source"),
      notes: optional(fd, "notes"),
      status: pick(str(fd, "status"), CLIENT_STATUSES, "PROSPECT"),
      userId: await findUserIdForEmail(email),
    },
  });
  refresh();
  redirect(lp(locale, `/admin/clients/${client.id}`));
}

export async function updateClient(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const id = str(fd, "id");
  const here = lp(locale, `/admin/clients/${id}`);

  const name = str(fd, "name");
  const email = optional(fd, "email")?.toLowerCase() ?? null;
  if (!name) fail(here, "Please enter the client's name.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(here, "That email address doesn't look right.");
  if (email) {
    const other = await prisma.client.findUnique({ where: { email } });
    if (other && other.id !== id) fail(here, "Another client already uses that email.");
  }

  const current = await prisma.client.findUnique({ where: { id }, select: { userId: true } });
  await prisma.client.update({
    where: { id },
    data: {
      name,
      email,
      phone: optional(fd, "phone"),
      company: optional(fd, "company"),
      source: optional(fd, "source"),
      notes: optional(fd, "notes"),
      status: pick(str(fd, "status"), CLIENT_STATUSES, "PROSPECT"),
      userId: current?.userId ?? (await findUserIdForEmail(email)),
    },
  });
  refresh();
  redirect(`${here}?saved=1`);
}

// ---------------------------------------------------------------- payments

export async function addPayment(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const here = returnTo(fd, lp(locale, "/admin/payments"));

  const clientId = str(fd, "clientId");
  const description = str(fd, "description");
  const amountCents = parseAmount(str(fd, "amount"));
  const status = pick(str(fd, "status"), PAYMENT_STATUSES, "PENDING");

  if (!clientId) fail(here, "Please choose a client.");
  if (!description) fail(here, "Please add a short description.");
  if (amountCents == null) fail(here, "Please enter an amount greater than zero.");
  if (!(await prisma.client.findUnique({ where: { id: clientId }, select: { id: true } }))) {
    fail(here, "That client no longer exists.");
  }

  const due = str(fd, "dueDate");
  await prisma.payment.create({
    data: {
      clientId,
      description,
      amountCents,
      currency: (str(fd, "currency") || "usd").toLowerCase().slice(0, 3),
      method: pick(str(fd, "method"), METHODS, "BANK_TRANSFER"),
      status,
      reference: optional(fd, "reference"),
      dueDate: due ? new Date(due) : null,
      paidAt: status === "PAID" ? new Date() : null,
    },
  });
  refresh();
  redirect(here);
}

export async function setPaymentStatus(fd: FormData) {
  await assertAdmin();
  const status = pick(str(fd, "status"), PAYMENT_STATUSES, "PENDING");
  await prisma.payment.update({
    where: { id: str(fd, "id") },
    data: { status, paidAt: status === "PAID" ? new Date() : null },
  });
  refresh();
  redirect(returnTo(fd, lp(localeOf(fd), "/admin/payments")));
}

export async function deletePayment(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id");
  const payment = await prisma.payment.findUnique({ where: { id }, select: { status: true } });
  // Money that was actually received is a record you shouldn't erase.
  // Mark it refunded instead, which keeps the history.
  if (payment?.status === "PENDING") await prisma.payment.delete({ where: { id } });
  refresh();
  redirect(returnTo(fd, lp(localeOf(fd), "/admin/payments")));
}
