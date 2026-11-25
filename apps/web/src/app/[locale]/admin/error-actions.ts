"use server";

import { redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { assertAdmin } from "@/lib/admin";
import { localeOf, refresh, str } from "@/lib/admin-form";
import { lp } from "@/i18n/config";

export async function resolveError(fd: FormData) {
  await assertAdmin();
  await prisma.errorLog.update({ where: { id: str(fd, "id") }, data: { resolved: true } });
  refresh();
  redirect(lp(localeOf(fd), "/admin/errors"));
}

export async function resolveAllErrors(fd: FormData) {
  await assertAdmin();
  await prisma.errorLog.updateMany({ where: { resolved: false }, data: { resolved: true } });
  refresh();
  redirect(lp(localeOf(fd), "/admin/errors"));
}

export async function deleteResolvedErrors(fd: FormData) {
  await assertAdmin();
  await prisma.errorLog.deleteMany({ where: { resolved: true } });
  refresh();
  redirect(lp(localeOf(fd), "/admin/errors"));
}
