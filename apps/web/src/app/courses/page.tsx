import type { Metadata } from "next";
import { prisma } from "@brand/db";
import { ProductCard } from "@/components/product-card";
import { PageIntro } from "@/components/section-heading";

export const metadata: Metadata = { title: "Courses" };
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await prisma.product.findMany({
    where: { type: "COURSE", published: true },
    orderBy: { position: "asc" },
  });

  return (
    <>
      <PageIntro
        eyebrow="Courses"
        title="Learn to build a business that lasts"
        body="Short, practical lessons. Do the task, move on, see results. Lifetime access to everything you buy."
      />
      <div className="wrap grid gap-5 py-14 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
