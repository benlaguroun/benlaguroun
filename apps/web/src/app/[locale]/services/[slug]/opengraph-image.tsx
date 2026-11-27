import { ogContentType, ogSize } from "@/lib/og";
import { productOgImage } from "@/lib/og-product";

export const alt = "Share preview";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  return productOgImage(locale, slug);
}
