"use server";

import { redirect } from "next/navigation";
import { Prisma, prisma } from "@brand/db";
import { assertAdmin } from "@/lib/admin";
import { buildTranslations, checked, cleanUrl, fail, isSlug, localeOf, refresh, slugify, str } from "@/lib/admin-form";
import { lp } from "@/i18n/config";

const asJson = (value: unknown) => (value == null ? Prisma.DbNull : (value as Prisma.InputJsonObject));

export async function savePost(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const id = str(fd, "id");
  const base = lp(locale, "/admin/posts");
  const here = id ? `${base}/${id}` : `${base}/new`;

  const existing = id ? await prisma.post.findUnique({ where: { id } }) : null;
  if (id && !existing) fail(base, "That article no longer exists.");

  const title = str(fd, "title");
  const excerpt = str(fd, "excerpt");
  const body = str(fd, "body");
  if (!title) fail(here, "Please enter a title.");
  if (!excerpt) fail(here, "Please write a short summary. It shows on the blog page and in search results.");
  if (!body) fail(here, "The article text is empty.");
  if (excerpt.length > 300) fail(here, "Keep the summary under 300 characters so search engines don't cut it off.");

  const slug = str(fd, "slug").toLowerCase() || slugify(title);
  if (!isSlug(slug)) fail(here, "The web address (slug) can only use lowercase letters, numbers and dashes.");
  const taken = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
  if (taken && taken.id !== existing?.id) fail(here, "Another article already uses that web address (slug).");

  const coverUrl = cleanUrl(str(fd, "coverUrl"), true);
  if (coverUrl === undefined) fail(here, "The cover image address isn't valid. Use a full https link or a path like /images/cover.png.");

  const tags = str(fd, "tags")
    .split(",")
    .map((t) => t.trim().slice(0, 30))
    .filter(Boolean)
    .slice(0, 6);

  const published = checked(fd, "published");
  const data = {
    slug,
    title,
    excerpt,
    body,
    coverUrl,
    tags,
    published,
    // The publish date is set the first time and then kept, so editing or
    // hiding and republishing doesn't move the article to the top again.
    publishedAt: published ? (existing?.publishedAt ?? new Date()) : (existing?.publishedAt ?? null),
    translations: asJson(buildTranslations(fd, existing?.translations, [{ key: "title" }, { key: "excerpt" }, { key: "body" }])),
  };

  if (existing) {
    await prisma.post.update({ where: { id: existing.id }, data });
    refresh();
    redirect(`${here}?saved=1`);
  }
  const created = await prisma.post.create({ data });
  refresh();
  redirect(`${base}/${created.id}?saved=1`);
}

export async function setPostPublished(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id");
  const publish = str(fd, "published") === "1";
  const post = await prisma.post.findUnique({ where: { id }, select: { publishedAt: true } });
  if (post) {
    await prisma.post.update({
      where: { id },
      data: { published: publish, publishedAt: publish ? (post.publishedAt ?? new Date()) : post.publishedAt },
    });
  }
  refresh();
  redirect(lp(localeOf(fd), "/admin/posts"));
}

export async function deletePost(fd: FormData) {
  await assertAdmin();
  await prisma.post.delete({ where: { id: str(fd, "id") } });
  refresh();
  redirect(`${lp(localeOf(fd), "/admin/posts")}?saved=1`);
}
