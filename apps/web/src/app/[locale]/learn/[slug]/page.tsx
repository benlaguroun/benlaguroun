import { notFound, redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { resolveLocale } from "@/i18n/resolve";
import { requireSession } from "@/lib/session";
import { userOwns } from "@/lib/access";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

// /learn/<course> sends members straight to the next lesson they haven't finished.
export default async function LearnIndex({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const session = await requireSession(locale, lp(locale, `/learn/${slug}`));

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { position: "asc" },
            include: { lessons: { orderBy: { position: "asc" }, select: { id: true } } },
          },
        },
      },
    },
  });
  if (!product || product.type !== "COURSE" || !product.course) notFound();

  if (!(await userOwns(session.user as { id: string; role?: string | null }, product.id))) {
    redirect(lp(locale, `/courses/${slug}`));
  }

  const lessonIds = product.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  if (lessonIds.length === 0) redirect(lp(locale, `/courses/${slug}`));

  const done = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: lessonIds } },
    select: { lessonId: true },
  });
  const doneSet = new Set(done.map((d) => d.lessonId));
  const next = lessonIds.find((id) => !doneSet.has(id)) ?? lessonIds[0]!;

  redirect(lp(locale, `/learn/${slug}/${next}`));
}
