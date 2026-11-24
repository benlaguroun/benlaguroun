"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@brand/db";
import { getSession } from "@/lib/session";
import { userOwns } from "@/lib/access";

export type LeadState = { ok: boolean; message: string } | null;

export async function createLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Honeypot: real people leave this hidden field empty.
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true, message: "Thanks! We'll be in touch soon." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const interest = String(formData.get("interest") ?? "").trim() || null;
  const budget = String(formData.get("budget") ?? "").trim() || null;

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in your name, email and a short message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "That email address doesn't look right." };
  }
  if (message.length > 5000) {
    return { ok: false, message: "Please keep your message under 5000 characters." };
  }

  await prisma.lead.create({ data: { name, email, message, interest, budget } });
  return { ok: true, message: "Thanks! Your message is in and you'll hear back shortly." };
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

  revalidatePath(`/learn/${courseSlug}`, "layout");
  revalidatePath("/dashboard");
}
