import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { prisma } from "@brand/db";
import { defaultLocale, lp } from "@/i18n/config";
import { isPrivateName, privateDir, privateTypes, safeDownloadName, verifyDownloadToken } from "@/lib/downloads";
import { rateLimited } from "@/lib/rate-limit";
import { getSession } from "@/lib/session";
import { reportError } from "@/lib/errors";

export const dynamic = "force-dynamic";

/**
 * Hands a template to someone who bought it. The visitor is either signed in or
 * carries a signed, expiring link from their receipt email. Ownership is
 * checked every time, so a refund stops access immediately.
 */
export async function GET(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const url = new URL(req.url);
  const token = url.searchParams.get("t");

  let userId: string | null = null;
  if (token) {
    userId = verifyDownloadToken(productId, token);
    if (!userId) {
      return new Response("This download link has expired. Sign in and download it from your library.", { status: 410 });
    }
  } else {
    userId = (await getSession())?.user.id ?? null;
    if (!userId) {
      return NextResponse.redirect(new URL(`${lp(defaultLocale, "/login")}?next=${encodeURIComponent(url.pathname)}`, url));
    }
  }

  // Stops one account (or a leaked link) from being used to pull the file over and over.
  if (rateLimited(`download:${userId}:${productId}`, 20, 60 * 60_000)) {
    return new Response("Too many downloads. Please try again in an hour.", { status: 429 });
  }

  const owned = await prisma.entitlement.findUnique({
    where: { userId_productId: { userId, productId } },
    include: { product: { select: { slug: true, deliveryUrl: true, deliveryFile: true, deliveryName: true } } },
  });
  if (!owned) return new Response("You don't have access to this download.", { status: 403 });

  const { slug, deliveryUrl, deliveryFile, deliveryName } = owned.product;

  if (deliveryFile && isPrivateName(deliveryFile)) {
    try {
      const full = path.join(privateDir(), deliveryFile);
      const { size } = await stat(full);
      const ext = deliveryFile.split(".").pop() as keyof typeof privateTypes;
      const name = safeDownloadName(deliveryName, `${slug}.${ext}`);
      return new Response(Readable.toWeb(createReadStream(full)) as ReadableStream, {
        headers: {
          "Content-Type": privateTypes[ext],
          "Content-Length": String(size),
          // `filename` for old browsers, `filename*` for names with accents or Arabic letters.
          "Content-Disposition": `attachment; filename="${name.replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(name)}`,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (err) {
      await reportError("server", err, `Download of ${slug}`);
      return new Response("The file is not available right now. Please contact support.", { status: 500 });
    }
  }

  // Older products use an external link. It is only revealed after the checks above.
  if (deliveryUrl) return NextResponse.redirect(deliveryUrl);

  return new Response("Nothing to download yet.", { status: 404 });
}
