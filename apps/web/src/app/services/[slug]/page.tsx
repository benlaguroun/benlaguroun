import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { formatPrice, paragraphs } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getService(slug: string) {
  const p = await prisma.product.findUnique({ where: { slug } });
  return p && p.type === "SERVICE" && p.published ? p : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getService(slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr]">
      <article>
        <Link href="/services" className="text-sm text-muted hover:text-ink">← All services</Link>
        <p className="eyebrow mt-6">Service</p>
        <h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">{service.name}</h1>
        <p className="mt-4 text-xl text-muted">{service.tagline}</p>
        <div className="mt-8 space-y-4 text-lg leading-relaxed">
          {paragraphs(service.description).map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </article>

      <aside className="card sticky top-24 h-fit space-y-5 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {service.priceCents != null ? "Starting at" : "Pricing"}
          </p>
          <p className="display mt-1 text-4xl font-semibold">{formatPrice(service.priceCents, service.currency)}</p>
        </div>
        <Link href={`/contact?service=${service.slug}`} className="btn-primary w-full">
          Start this project
        </Link>
        <ul className="space-y-2 border-t border-line pt-5 text-sm">
          {service.features.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-accent" aria-hidden>✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
