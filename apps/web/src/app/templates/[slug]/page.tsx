import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { paragraphs } from "@/lib/format";
import { getSession } from "@/lib/session";
import { userOwns } from "@/lib/access";
import { PurchasePanel } from "@/components/purchase-panel";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getTemplate(slug: string) {
  const p = await prisma.product.findUnique({ where: { slug } });
  return p && p.type === "TEMPLATE" && p.published ? p : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getTemplate(slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const product = await getTemplate(slug);
  if (!product) notFound();

  const session = await getSession();
  const owned = await userOwns(session?.user as { id: string; role?: string | null } | undefined, product.id);

  return (
    <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr]">
      <article>
        <Link href="/templates" className="text-sm text-muted hover:text-ink">← All templates</Link>
        <p className="eyebrow mt-6">Template</p>
        <h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-xl text-muted">{product.tagline}</p>
        <div className="mt-8 space-y-4 text-lg leading-relaxed">
          {paragraphs(product.description).map((para, i) => <p key={i}>{para}</p>)}
        </div>
        {product.previewUrl && (
          <a href={product.previewUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-8">
            View live demo ↗
          </a>
        )}
      </article>

      <PurchasePanel product={product} signedIn={!!session} owned={owned} />
    </div>
  );
}
