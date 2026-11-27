"use server";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { Prisma, prisma } from "@brand/db";
import { assertAdmin } from "@/lib/admin";
import { parseAmount } from "@/lib/admin-format";
import {
  buildTranslations,
  checked,
  cleanUrl,
  fail,
  int,
  isSlug,
  lines,
  localeOf,
  optional,
  refresh,
  slugify,
  str,
} from "@/lib/admin-form";
import { toEmbedUrl } from "@/lib/video";
import { lp } from "@/i18n/config";
import { isPrivateName, privateDir, safeDownloadName } from "@/lib/downloads";

// Actions for the content editors: products, courses, testimonials and
// subscribers. Every one starts with assertAdmin(), the same as actions.ts.

const TYPES = ["SERVICE", "TEMPLATE", "COURSE"] as const;

const asJson = (value: unknown) => (value == null ? Prisma.DbNull : (value as Prisma.InputJsonObject));

// ----------------------------------------------------------------- products

export async function saveProduct(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const id = str(fd, "id");
  const base = lp(locale, "/admin/products");

  const existing = id ? await prisma.product.findUnique({ where: { id } }) : null;
  if (id && !existing) fail(base, "That product no longer exists.");

  const typeInput = str(fd, "type");
  const type = existing?.type ?? TYPES.find((t) => t === typeInput);
  const here = existing ? `${base}/${existing.id}` : `${base}/new${type ? `?type=${type}` : ""}`;
  if (!type) fail(here, "Please choose what kind of product this is.");

  const name = str(fd, "name");
  const tagline = str(fd, "tagline");
  const description = str(fd, "description");
  if (!name) fail(here, "Please enter a name.");
  if (!tagline) fail(here, "Please add a one-line tagline.");
  if (!description) fail(here, "Please add a description.");

  const slug = str(fd, "slug").toLowerCase() || slugify(name);
  if (!isSlug(slug)) fail(here, "The web address (slug) can only use lowercase letters, numbers and dashes.");
  const taken = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
  if (taken && taken.id !== existing?.id) fail(here, "Another product already uses that web address (slug).");

  const priceRaw = str(fd, "price");
  let priceCents: number | null = null;
  if (priceRaw) {
    priceCents = parseAmount(priceRaw);
    if (priceCents == null) fail(here, "Please enter a price greater than zero, for example 149 or 49.50.");
  } else if (type !== "SERVICE") {
    fail(here, "Templates and courses need a price so people can buy them.");
  }

  const currency = (str(fd, "currency") || "usd").toLowerCase();
  if (!/^[a-z]{3}$/.test(currency)) fail(here, "The currency should be a 3-letter code such as usd, eur or mad.");

  const imageUrl = cleanUrl(str(fd, "imageUrl"), true);
  if (imageUrl === undefined) fail(here, "The image address isn't valid. Use a full https link or a path like /images/cover.png.");

  const templateFields =
    type === "TEMPLATE"
      ? (() => {
          const deliveryUrl = cleanUrl(str(fd, "deliveryUrl"));
          const previewUrl = cleanUrl(str(fd, "previewUrl"));
          if (deliveryUrl === undefined) fail(here, "The download link isn't a valid web address.");
          if (previewUrl === undefined) fail(here, "The preview link isn't a valid web address.");
          const deliveryFile = str(fd, "deliveryFile");
          if (deliveryFile && !isPrivateName(deliveryFile)) fail(here, "That uploaded file isn't valid. Please upload it again.");
          const deliveryName = deliveryFile ? safeDownloadName(str(fd, "deliveryName"), "download") : null;
          return { deliveryUrl, previewUrl, deliveryFile: deliveryFile || null, deliveryName };
        })()
      : {};

  const translations = buildTranslations(fd, existing?.translations, [
    { key: "name" },
    { key: "tagline" },
    { key: "description" },
    { key: "features", list: true },
  ]);

  let position = int(fd, "position", Number.NaN);
  if (!Number.isFinite(position)) {
    const last = await prisma.product.findFirst({ where: { type }, orderBy: { position: "desc" }, select: { position: true } });
    position = (last?.position ?? 0) + 1;
  }

  const data = {
    slug,
    name,
    tagline,
    description,
    priceCents,
    currency,
    imageUrl,
    features: lines(str(fd, "features"), 12),
    published: checked(fd, "published"),
    comingSoon: checked(fd, "comingSoon"),
    featured: checked(fd, "featured"),
    position,
    translations: asJson(translations),
    ...templateFields,
  };

  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data });
    // A replaced or removed template file is deleted from the server (unless another product uses it).
    const old = existing.deliveryFile;
    if (old && isPrivateName(old) && old !== (data as { deliveryFile?: string | null }).deliveryFile) {
      const stillUsed = await prisma.product.count({ where: { deliveryFile: old } });
      if (!stillUsed) await unlink(path.join(privateDir(), old)).catch(() => {});
    }
    refresh();
    redirect(`${here}?saved=1`);
  }

  const created = await prisma.product.create({
    data: { ...data, type, ...(type === "COURSE" ? { course: { create: {} } } : {}) },
  });
  refresh();
  // A new course goes straight to the curriculum, where the lessons are added.
  redirect(type === "COURSE" ? `${base}/${created.id}/curriculum` : `${base}/${created.id}?saved=1`);
}

export async function setProductPublished(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  await prisma.product.update({ where: { id: str(fd, "id") }, data: { published: str(fd, "published") === "1" } });
  refresh();
  redirect(lp(locale, "/admin/products"));
}

export async function deleteProduct(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const id = str(fd, "id");
  const here = lp(locale, `/admin/products/${id}`);

  // Orders keep a link to the product, so a product that was ever bought can't
  // be removed without breaking the sales history. Unpublish it instead.
  if ((await prisma.order.count({ where: { productId: id } })) > 0) {
    fail(here, "This product has orders, so it can't be deleted. Unpublish it instead and it disappears from the site.");
  }
  await prisma.product.delete({ where: { id } });
  refresh();
  redirect(`${lp(locale, "/admin/products")}?saved=1`);
}

// ------------------------------------------------------------------ courses

async function courseFor(productId: string, back: string) {
  const course = await prisma.course.findUnique({ where: { productId }, select: { id: true } });
  if (!course) fail(back, "That course no longer exists.");
  return course;
}

/** Number the siblings 1..n in their current order, then swap one with its neighbour. */
async function swapNeighbour(ids: string[], id: string, dir: string, apply: (id: string, position: number) => Prisma.PrismaPromise<unknown>) {
  const i = ids.indexOf(id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= ids.length) return;
  const order = [...ids];
  const a = order[i] as string;
  order[i] = order[j] as string;
  order[j] = a;
  await prisma.$transaction(order.map((rowId, index) => apply(rowId, index + 1)));
}

export async function addModule(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const productId = str(fd, "productId");
  const here = lp(locale, `/admin/products/${productId}/curriculum`);

  const title = str(fd, "title");
  if (!title) fail(here, "Please give the module a title.");
  const course = await courseFor(productId, here);
  const last = await prisma.module.findFirst({ where: { courseId: course.id }, orderBy: { position: "desc" }, select: { position: true } });
  await prisma.module.create({ data: { courseId: course.id, title, position: (last?.position ?? 0) + 1 } });
  refresh();
  redirect(`${here}?saved=1`);
}

export async function updateModule(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const here = lp(locale, `/admin/products/${str(fd, "productId")}/curriculum`);
  const mod = await prisma.module.findUnique({ where: { id: str(fd, "id") }, select: { id: true, translations: true } });
  if (!mod) fail(here, "That module no longer exists.");

  const title = str(fd, "title");
  if (!title) fail(here, "Please give the module a title.");
  await prisma.module.update({
    where: { id: mod.id },
    data: { title, translations: asJson(buildTranslations(fd, mod.translations, [{ key: "title" }])) },
  });
  refresh();
  redirect(`${here}?saved=1`);
}

export async function deleteModule(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  await prisma.module.delete({ where: { id: str(fd, "id") } });
  refresh();
  redirect(`${lp(locale, `/admin/products/${str(fd, "productId")}/curriculum`)}?saved=1`);
}

export async function moveModule(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const productId = str(fd, "productId");
  const here = lp(locale, `/admin/products/${productId}/curriculum`);
  const course = await courseFor(productId, here);
  const siblings = await prisma.module.findMany({
    where: { courseId: course.id },
    orderBy: [{ position: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  await swapNeighbour(siblings.map((s) => s.id), str(fd, "id"), str(fd, "dir"), (rowId, position) =>
    prisma.module.update({ where: { id: rowId }, data: { position } }),
  );
  refresh();
  redirect(here);
}

export async function saveLesson(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const productId = str(fd, "productId");
  const moduleId = str(fd, "moduleId");
  const id = str(fd, "id");
  const curriculum = lp(locale, `/admin/products/${productId}/curriculum`);
  const here = id
    ? lp(locale, `/admin/products/${productId}/lessons/${id}`)
    : `${lp(locale, `/admin/products/${productId}/lessons/new`)}?module=${encodeURIComponent(moduleId)}`;

  const existing = id ? await prisma.lesson.findUnique({ where: { id } }) : null;
  if (id && !existing) fail(curriculum, "That lesson no longer exists.");
  const mod = await prisma.module.findUnique({ where: { id: existing?.moduleId ?? moduleId }, select: { id: true, course: { select: { productId: true } } } });
  if (!mod || mod.course.productId !== productId) fail(curriculum, "That module no longer exists.");

  const title = str(fd, "title");
  if (!title) fail(here, "Please give the lesson a title.");

  let videoUrl: string | null = null;
  const videoRaw = str(fd, "videoUrl");
  if (videoRaw) {
    videoUrl = toEmbedUrl(videoRaw);
    if (!videoUrl) fail(here, "That video link isn't supported. Paste a YouTube or Vimeo link, or another https embed link.");
  }

  const durationRaw = str(fd, "durationMin");
  let durationMin: number | null = null;
  if (durationRaw) {
    durationMin = Number.parseInt(durationRaw, 10);
    if (!Number.isFinite(durationMin) || durationMin < 1 || durationMin > 600) fail(here, "The duration should be a number of minutes, for example 12.");
  }

  const data = {
    title,
    summary: optional(fd, "summary"),
    content: str(fd, "content"),
    videoUrl,
    durationMin,
    isPreview: checked(fd, "isPreview"),
    translations: asJson(
      buildTranslations(fd, existing?.translations, [{ key: "title" }, { key: "summary" }, { key: "content" }]),
    ),
  };

  if (existing) {
    await prisma.lesson.update({ where: { id: existing.id }, data });
    refresh();
    redirect(`${here}?saved=1`);
  }

  // The slug must be unique inside its module: add -2, -3... if the title repeats.
  const baseSlug = slugify(title) || "lesson";
  let slug = baseSlug;
  for (let n = 2; await prisma.lesson.findFirst({ where: { moduleId: mod.id, slug }, select: { id: true } }); n++) {
    slug = `${baseSlug}-${n}`;
  }
  const last = await prisma.lesson.findFirst({ where: { moduleId: mod.id }, orderBy: { position: "desc" }, select: { position: true } });
  await prisma.lesson.create({ data: { ...data, moduleId: mod.id, slug, position: (last?.position ?? 0) + 1 } });
  refresh();
  redirect(`${curriculum}?saved=1`);
}

export async function deleteLesson(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  await prisma.lesson.delete({ where: { id: str(fd, "id") } });
  refresh();
  redirect(`${lp(locale, `/admin/products/${str(fd, "productId")}/curriculum`)}?saved=1`);
}

export async function moveLesson(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const here = lp(locale, `/admin/products/${str(fd, "productId")}/curriculum`);
  const lesson = await prisma.lesson.findUnique({ where: { id: str(fd, "id") }, select: { moduleId: true } });
  if (!lesson) redirect(here);
  const siblings = await prisma.lesson.findMany({
    where: { moduleId: lesson.moduleId },
    orderBy: [{ position: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  await swapNeighbour(siblings.map((s) => s.id), str(fd, "id"), str(fd, "dir"), (rowId, position) =>
    prisma.lesson.update({ where: { id: rowId }, data: { position } }),
  );
  refresh();
  redirect(here);
}

// ------------------------------------------------------------ testimonials

export async function saveTestimonial(fd: FormData) {
  await assertAdmin();
  const locale = localeOf(fd);
  const here = lp(locale, "/admin/testimonials");
  const id = str(fd, "id");

  const name = str(fd, "name");
  const quote = str(fd, "quote");
  if (!name) fail(here, "Please enter who said it.");
  if (!quote) fail(here, "Please enter the quote.");
  if (quote.length > 1000) fail(here, "Please keep the quote under 1000 characters.");

  const existing = id ? await prisma.testimonial.findUnique({ where: { id }, select: { translations: true } }) : null;
  if (id && !existing) fail(here, "That testimonial no longer exists.");

  const data = {
    name,
    role: optional(fd, "role"),
    quote,
    published: checked(fd, "published"),
    position: int(fd, "position", 0),
    translations: asJson(buildTranslations(fd, existing?.translations, [{ key: "role" }, { key: "quote" }])),
  };

  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  refresh();
  redirect(`${here}?saved=1`);
}

export async function setTestimonialPublished(fd: FormData) {
  await assertAdmin();
  await prisma.testimonial.update({ where: { id: str(fd, "id") }, data: { published: str(fd, "published") === "1" } });
  refresh();
  redirect(lp(localeOf(fd), "/admin/testimonials"));
}

export async function deleteTestimonial(fd: FormData) {
  await assertAdmin();
  await prisma.testimonial.delete({ where: { id: str(fd, "id") } });
  refresh();
  redirect(`${lp(localeOf(fd), "/admin/testimonials")}?saved=1`);
}

// -------------------------------------------------------------- subscribers

export async function deleteSubscriber(fd: FormData) {
  await assertAdmin();
  await prisma.subscriber.delete({ where: { id: str(fd, "id") } });
  refresh();
  redirect(lp(localeOf(fd), "/admin/subscribers"));
}
