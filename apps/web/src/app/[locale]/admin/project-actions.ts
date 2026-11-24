"use server";

import { redirect } from "next/navigation";
import { Prisma, prisma } from "@brand/db";
import { assertAdmin } from "@/lib/admin";
import { buildTranslations, checked, cleanUrl, fail, int, isSlug, lines, localeOf, optional, refresh, slugify, str } from "@/lib/admin-form";
import { lp } from "@/i18n/config";

const asJson = (value: unknown) => (value == null ? Prisma.DbNull : (value as Prisma.InputJsonObject));

export async function saveProject(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const id = str(fd, "id");
  const base = lp(locale, "/admin/projects");
  const here = id ? `${base}/${id}` : `${base}/new`;

  const existing = id ? await prisma.project.findUnique({ where: { id } }) : null;
  if (id && !existing) fail(base, "That project no longer exists.");

  const title = str(fd, "title");
  const summary = str(fd, "summary");
  const body = str(fd, "body");
  if (!title) fail(here, "Please enter a title.");
  if (!summary) fail(here, "Please write a one or two sentence summary.");
  if (!body) fail(here, "Please describe the project.");

  const slug = str(fd, "slug").toLowerCase() || slugify(title);
  if (!isSlug(slug)) fail(here, "The web address (slug) can only use lowercase letters, numbers and dashes.");
  const taken = await prisma.project.findUnique({ where: { slug }, select: { id: true } });
  if (taken && taken.id !== existing?.id) fail(here, "Another project already uses that web address (slug).");

  const liveUrl = cleanUrl(str(fd, "liveUrl"));
  if (liveUrl === undefined) fail(here, "The demo link isn't a valid web address.");
  const imageUrl = cleanUrl(str(fd, "imageUrl"), true);
  if (imageUrl === undefined) fail(here, "The cover image address isn't valid. Use a full https link or upload one.");

  const images: string[] = [];
  for (const line of lines(str(fd, "images"), 12, 400)) {
    const url = cleanUrl(line, true);
    if (!url) fail(here, `This screenshot address isn't valid: ${line.slice(0, 60)}`);
    images.push(url);
  }

  const tags = str(fd, "tags")
    .split(",")
    .map((t) => t.trim().slice(0, 30))
    .filter(Boolean)
    .slice(0, 8);

  let position = int(fd, "position", Number.NaN);
  if (!Number.isFinite(position)) {
    const last = await prisma.project.findFirst({ orderBy: { position: "desc" }, select: { position: true } });
    position = (last?.position ?? 0) + 1;
  }

  const data = {
    slug,
    title,
    client: optional(fd, "client"),
    summary,
    body,
    tags,
    imageUrl,
    images,
    liveUrl,
    featured: checked(fd, "featured"),
    position,
    translations: asJson(buildTranslations(fd, existing?.translations, [{ key: "title" }, { key: "summary" }, { key: "body" }])),
  };

  if (existing) {
    await prisma.project.update({ where: { id: existing.id }, data });
    refresh();
    redirect(`${here}?saved=1`);
  }
  const created = await prisma.project.create({ data });
  refresh();
  redirect(`${base}/${created.id}?saved=1`);
}

export async function deleteProject(fd: FormData) {
  await assertAdmin();
  await prisma.project.delete({ where: { id: str(fd, "id") } });
  refresh();
  redirect(`${lp(localeOf(fd), "/admin/projects")}?saved=1`);
}
