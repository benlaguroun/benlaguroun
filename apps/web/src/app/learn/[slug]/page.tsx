import { notFound, redirect } from "next/navigation";
import { prisma } from "@brand/db";
import { requireSession } from "@/lib/session";
import { userOwns } from "@/lib/access";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// /learn/<course> sends members straight to the next lesson they haven't finished.
export default async function LearnIndex({ params }: Props) {
  const { slug } = await params;
  const session = await requireSession(`/learn/${slug}`);

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
    redirect(`/courses/${slug}`);
  }

  const lessonIds = product.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  if (lessonIds.length === 0) redirect(`/courses/${slug}`);

  const done = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: lessonIds } },
    select: { lessonId: true },
  });
  const doneSet = new Set(done.map((d) => d.lessonId));
  const next = lessonIds.find((id) => !doneSet.has(id)) ?? lessonIds[0]!;

  redirect(`/learn/${slug}/${next}`);
}
