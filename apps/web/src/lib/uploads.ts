import path from "node:path";

/** Where uploaded images are stored on the server's disk. Keep this folder in your backups. */
export const uploadDir = () => process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const FILE_NAME = /^[0-9a-f-]{36}\.(png|jpg|webp|gif)$/;
export const isUploadName = (name: string) => FILE_NAME.test(name);

export const contentTypes = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
} as const;

/**
 * Work out what an image really is from its first bytes, not from the name or
 * the type the browser claims. Only these four formats are accepted (no SVG,
 * which can carry scripts).
 */
export function sniffImage(bytes: Uint8Array): keyof typeof contentTypes | null {
  const at = (i: number) => bytes[i] ?? -1;
  if (at(0) === 0x89 && at(1) === 0x50 && at(2) === 0x4e && at(3) === 0x47) return "png";
  if (at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) return "jpg";
  if (at(0) === 0x47 && at(1) === 0x49 && at(2) === 0x46 && at(3) === 0x38) return "gif";
  if (at(0) === 0x52 && at(1) === 0x49 && at(2) === 0x46 && at(3) === 0x46 && at(8) === 0x57 && at(9) === 0x45 && at(10) === 0x42 && at(11) === 0x50) return "webp";
  return null;
}
