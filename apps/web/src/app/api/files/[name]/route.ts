import { readFile } from "node:fs/promises";
import path from "node:path";
import { contentTypes, isUploadName, uploadDir } from "@/lib/uploads";

export const dynamic = "force-dynamic";

/** Serves an uploaded image. Names are random and checked, so nothing outside the uploads folder can be read. */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!isUploadName(name)) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(path.join(uploadDir(), name));
    const ext = name.split(".").pop() as keyof typeof contentTypes;
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": contentTypes[ext],
        // The name is random and never reused, so browsers may keep it for a year.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
