"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@brand/db";
import { getSession } from "@/lib/session";
import { userOwns } from "@/lib/access";
import { locales } from "@/i18n/config";

// The server returns a code; the form turns it into text in the visitor's language.
export type LeadState = { ok: true } | { ok: false; code: "missing" | "email" | "long" } | null;

export async function createLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Honeypot: real people leave this hidden field empty.
  if (String(formData.get("website") ?? "").trim()) return { ok: true };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const interest = String(formData.get("interest") ?? "").trim() || null;
  const budget = String(formData.get("budget") ?? "").trim() || null;

  if (!name || !email || !message) return { ok: false, code: "missing" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, code: "email" };
  if (message.length > 5000) return { ok: false, code: "long" };

  await prisma.lead.create({ data: { name, email, message, interest, budget } });
  return { ok: true };
}

export async function markLessonComplete(lessonId: string, courseSlug: string) {
  const session = await getSession();
  if (!session) return;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, module: { select: { course: { select: { productId: true } } } } },
  });
  if (!lesson) return;

  if (!(await userOwns(session.user as { id: string; role?: string | null }, lesson.module.course.productId))) return;

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: {},
    create: { userId: session.user.id, lessonId },
  });

  for (const locale of locales) revalidatePath(`/${locale}/learn/${courseSlug}`, "layout");
  for (const locale of locales) revalidatePath(`/${locale}/dashboard`);
}
