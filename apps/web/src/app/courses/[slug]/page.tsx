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

async function getCourse(slug: string) {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { position: "asc" },
            include: { lessons: { orderBy: { position: "asc" } } },
          },
        },
      },
    },
  });
  return p && p.type === "COURSE" && p.published && p.course ? { ...p, course: p.course } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getCourse(slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const product = await getCourse(slug);
  if (!product) notFound();

  const session = await getSession();
  const owned = await userOwns(session?.user as { id: string; role?: string | null } | undefined, product.id);

  const lessonCount = product.course.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr]">
      <article>
        <Link href="/courses" className="text-sm text-muted hover:text-ink">← All courses</Link>
        <p className="eyebrow mt-6">Course · {lessonCount} lessons</p>
        <h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-xl text-muted">{product.tagline}</p>
        <div className="mt-8 space-y-4 text-lg leading-relaxed">
          {paragraphs(product.description).map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <h2 className="display mt-12 text-2xl font-semibold">What's inside</h2>
        <div className="mt-5 space-y-4">
          {product.course.modules.map((m, mi) => (
            <section key={m.id} className="card overflow-hidden">
              <h3 className="border-b border-line bg-accent-soft/50 px-5 py-3 text-sm font-semibold">
                Module {mi + 1}: {m.title}
              </h3>
              <ul className="divide-y divide-line">
                {m.lessons.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                    <span>{l.title}</span>
                    <span className="flex shrink-0 items-center gap-3 text-muted">
                      {l.isPreview && (
                        <Link href={`/learn/${product.slug}/${l.id}`} className="chip">Free preview</Link>
                      )}
                      {l.durationMin ? `${l.durationMin} min` : null}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>

      <PurchasePanel product={product} signedIn={!!session} owned={owned} />
    </div>
  );
}
