import type { Metadata } from "next";
import { prisma } from "@brand/db";
import { ProductCard } from "@/components/product-card";
import { PageIntro } from "@/components/section-heading";

export const metadata: Metadata = { title: "Templates" };
export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await prisma.product.findMany({
    where: { type: "TEMPLATE", published: true },
    orderBy: { position: "asc" },
  });

  return (
    <>
      <PageIntro
        eyebrow="Templates"
        title="Ready-made starters you can ship today"
        body="Built from real client work. Buy once, use on unlimited projects, get updates for life."
      />
      <div className="wrap grid gap-5 py-14 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
