"use server";

import { redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { site } from "@/config/site";
import { assertAdmin } from "@/lib/admin";
import { fail, localeOf, refresh, str } from "@/lib/admin-form";
import { isProvider, runAgent } from "@/lib/agent";
import { emailConfigured, esc, ownerEmail, sendEmail } from "@/lib/email";
import { lp } from "@/i18n/config";

const home = (fd: FormData) => lp(localeOf(fd), "/admin/assistant");
const done = (fd: FormData, notice: string): never => redirect(`${home(fd)}?notice=${encodeURIComponent(notice)}`);

/** Send the reply you approved (with your edits) and mark the message as replied. */
export async function approveAndSend(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id");
  const body = String(fd.get("body") ?? "").trim().slice(0, 5000);
  const subject = str(fd, "subject").slice(0, 160) || "Re: your message";
  if (!body) fail(home(fd), "The reply is empty. Write something or reject the draft.");
  if (!emailConfigured()) fail(home(fd), "Email isn't set up (BREVO_API_KEY and EMAIL_FROM), so nothing can be sent.");

  const task = await prisma.agentTask.findUnique({ where: { id }, include: { lead: true } });
  if (!task || task.status !== "PENDING") fail(home(fd), "That draft was already decided.");
  if (!task!.lead) fail(home(fd), "The original message no longer exists, so there is nobody to send to.");

  const config = await prisma.agentConfig.findUnique({ where: { id: "main" } });
  const signature = (config?.signature ?? "").trim();
  const text = signature ? `${body}\n\n--\n${signature}` : body;
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#0f172a">${esc(text)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px">${p.replace(/\n/g, "<br>")}</p>`)
    .join("")}</div>`;

  try {
    await sendEmail({ to: task!.lead!.email, subject, html, text, replyTo: ownerEmail(site.email) });
  } catch (err) {
    console.error("Could not send the approved reply", err);
    fail(home(fd), "The email could not be sent. Check your Brevo settings. The draft is still waiting.");
  }

  await prisma.$transaction([
    prisma.agentTask.update({ where: { id }, data: { status: "SENT", finalText: text, subject, decidedAt: new Date() } }),
    prisma.lead.update({ where: { id: task!.lead!.id }, data: { status: "REPLIED" } }),
  ]);
  refresh();
  done(fd, "Reply sent.");
}

export async function rejectTask(fd: FormData) {
  await assertAdmin();
  await prisma.agentTask.updateMany({ where: { id: str(fd, "id"), status: "PENDING" }, data: { status: "REJECTED", decidedAt: new Date() } });
  refresh();
  done(fd, "Draft rejected. Nothing was sent.");
}

/** You answered it yourself (by phone, WhatsApp or your own email). */
export async function handledTask(fd: FormData) {
  await assertAdmin();
  const task = await prisma.agentTask.findUnique({ where: { id: str(fd, "id") } });
  if (task && task.status === "PENDING") {
    await prisma.agentTask.update({ where: { id: task.id }, data: { status: "HANDLED", decidedAt: new Date() } });
    if (task.leadId) await prisma.lead.update({ where: { id: task.leadId }, data: { status: "REPLIED" } });
  }
  refresh();
  done(fd, "Marked as handled by you.");
}

/** Ask Ben to read a message and draft a reply. Optionally with an order of your own. */
export async function askBen(fd: FormData) {
  await assertAdmin();
  const leadId = str(fd, "leadId");
  const instruction = str(fd, "instruction").slice(0, 1500);
  if (!leadId) fail(home(fd), "Choose the message Ben should work on.");
  const result = await runAgent({ leadId, kind: instruction ? "order" : "draft", instruction: instruction || undefined });
  refresh();
  if (!result.ok) fail(home(fd), result.reason);
  const back = str(fd, "returnTo");
  if (back.startsWith("/") && !back.startsWith("//")) redirect(`${back}${back.includes("?") ? "&" : "?"}notice=${encodeURIComponent("Ben prepared a draft. Review it on the Assistant page.")}`);
  done(fd, "Ben prepared a draft. Review it below.");
}

export async function saveAgentSettings(fd: FormData) {
  await assertAdmin();
  const limit = Math.max(1, Math.min(500, Math.round(Number(str(fd, "dailyLimit")) || 30)));
  const provider = str(fd, "provider");
  const data = {
    enabled: fd.get("enabled") === "on",
    provider: isProvider(provider) ? provider : "anthropic",
    fallback: fd.get("fallback") === "on",
    dailyLimit: limit,
    signature: str(fd, "signature").slice(0, 200),
    instructions: String(fd.get("instructions") ?? "").trim().slice(0, 4000),
  };
  await prisma.agentConfig.upsert({ where: { id: "main" }, create: { id: "main", ...data }, update: data });
  refresh();
  redirect(`${lp(localeOf(fd), "/admin/assistant/settings")}?notice=${encodeURIComponent("Settings saved.")}`);
}

/** The kill switch on the main page. */
export async function setAgentEnabled(fd: FormData) {
  await assertAdmin();
  const enabled = str(fd, "enabled") === "1";
  await prisma.agentConfig.upsert({ where: { id: "main" }, create: { id: "main", enabled }, update: { enabled } });
  refresh();
  done(fd, enabled ? "Ben is on." : "Ben is off. Nothing will run until you switch him on.");
}
