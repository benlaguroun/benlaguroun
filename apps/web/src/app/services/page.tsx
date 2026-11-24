import type { Metadata } from "next";
import { prisma } from "@brand/db";
import { ProductCard } from "@/components/product-card";
import { PageIntro } from "@/components/section-heading";

export const metadata: Metadata = { title: "Services" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.product.findMany({
    where: { type: "SERVICE", published: true },
    orderBy: { position: "asc" },
  });

  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Websites and platforms, built properly"
        body="Pick a package or tell me what you need. Every project includes a clear scope, a fixed timeline and a handover you can run yourself."
      />
      <div className="wrap grid gap-5 py-14 md:grid-cols-2 lg:grid-cols-3">
        {services.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
