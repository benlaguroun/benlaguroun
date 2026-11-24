import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@brand/db";
import { lp } from "@/i18n/config";
import { localize } from "@/i18n/content";
import { getDict } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/resolve";
import { paragraphs } from "@/lib/format";
import { getSession } from "@/lib/session";
import { userOwns } from "@/lib/access";
import { ArrowBack } from "@/components/icons";
import { PurchasePanel } from "@/components/purchase-panel";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getTemplate(slug: string) {
  const p = await prisma.product.findUnique({ where: { slug } });
  return p && p.type === "TEMPLATE" && p.published ? p : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const raw = await getTemplate(slug);
  if (!raw) return {};
  const p = localize(raw, locale);
  return { title: p.name, description: p.tagline };
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const t = getDict(locale);
  const raw = await getTemplate(slug);
  if (!raw) notFound();
  const product = localize(raw, locale);

  const session = await getSession();
  const owned = await userOwns(session?.user as { id: string; role?: string | null } | undefined, product.id);

  return (
    <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr]">
      <Reveal>
        <article>
          <Link href={lp(locale, "/templates")} className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink">
            <ArrowBack /> {t.product.allTemplates}
          </Link>
          <p className="eyebrow mt-8">{t.product.types.TEMPLATE}</p>
          <h1 className="display mt-3 text-4xl font-semibold sm:text-6xl">
            <span className="text-gradient">{product.name}</span>
          </h1>
          <p className="mt-5 text-xl text-mute">{product.tagline}</p>
          <div className="mt-8 space-y-4 text-lg leading-relaxed">
            {paragraphs(product.description).map((para, i) => <p key={i}>{para}</p>)}
          </div>
          {product.previewUrl && (
            <a href={product.previewUrl} target="_blank" rel="noreferrer" className="btn btn-glass mt-8">
              {t.product.liveDemo} ↗
            </a>
          )}
        </article>
      </Reveal>

      <Reveal delay={120}>
        <PurchasePanel product={product} locale={locale} signedIn={!!session} owned={owned} />
      </Reveal>
    </div>
  );
}
