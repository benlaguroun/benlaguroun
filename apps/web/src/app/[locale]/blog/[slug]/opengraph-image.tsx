import { prisma } from "@brand/db";
import { localize } from "@/i18n/content";
import { ogCard, ogContentType, ogLocale, ogSize } from "@/lib/og";

export const alt = "Share preview";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = ogLocale(rawLocale);
  const raw = await prisma.post.findUnique({ where: { slug } });
  if (!raw || !raw.published) return ogCard({ kicker: "Blog", title: "Not found" });
  const post = localize(raw, locale);
  return ogCard({ kicker: "Blog", title: post.title, subtitle: post.excerpt, badge: raw.tags[0] });
}
