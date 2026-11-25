"use server";

import { redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { assertAdmin } from "@/lib/admin";
import { localeOf, refresh, str } from "@/lib/admin-form";
import { roadmapKeys } from "@/lib/roadmap";
import { lp } from "@/i18n/config";

/** Tick or untick a step you do by hand. */
export async function setRoadmapItem(fd: FormData) {
  await assertAdmin();
  const key = str(fd, "key");
  const done = str(fd, "done") === "1";
  if (roadmapKeys.has(key)) {
    await prisma.roadmapItem.upsert({ where: { key }, create: { key, done }, update: { done } });
  }
  refresh();
  redirect(`${lp(localeOf(fd), "/admin/roadmap")}#${encodeURIComponent(key)}`);
}
