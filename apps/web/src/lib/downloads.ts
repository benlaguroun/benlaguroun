import { createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";
import { uploadDir } from "@/lib/uploads";
import { siteUrl } from "@/lib/site-url";

/** Template files are kept in a private folder that no public route can read. */
export const privateDir = () => path.join(uploadDir(), "private");

export const MAX_PRIVATE_BYTES = 100 * 1024 * 1024;

const FILE_NAME = /^[0-9a-f-]{36}\.(zip|pdf)$/;
export const isPrivateName = (name: string) => FILE_NAME.test(name);

export const privateTypes = { zip: "application/zip", pdf: "application/pdf" } as const;

/** Only ZIP and PDF files are accepted, judged by their first bytes, not by the file name. */
export function sniffPrivate(bytes: Uint8Array): keyof typeof privateTypes | null {
  const at = (i: number) => bytes[i] ?? -1;
  if (at(0) === 0x50 && at(1) === 0x4b && (at(2) === 0x03 || at(2) === 0x05) && (at(3) === 0x04 || at(3) === 0x06)) return "zip";
  if (at(0) === 0x25 && at(1) === 0x50 && at(2) === 0x44 && at(3) === 0x46) return "pdf";
  return null;
}

/** A file name that is safe to put in a download header. */
export function safeDownloadName(name: string | null | undefined, fallback: string) {
  const cleaned = (name ?? "").replace(/[\\/\r\n"]/g, "").replace(/[^\p{L}\p{N} ._()-]/gu, "").trim().slice(0, 120);
  return cleaned || fallback;
}

// ---------------------------------------------------------------------------
// Signed links, for emails. They let a buyer download without signing in, for a
// limited time. The server still checks that they own the product at that
// moment, so a refund cancels outstanding links.
// ---------------------------------------------------------------------------

function secret() {
  const s = process.env.BETTER_AUTH_SECRET;
  if (!s || (s === "change-me" && process.env.NODE_ENV === "production")) {
    throw new Error("BETTER_AUTH_SECRET must be set to a long random value");
  }
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(`download:${payload}`).digest("base64url");

export const LINK_DAYS = 7;

export function signedDownloadUrl(productId: string, userId: string, days = LINK_DAYS) {
  const exp = Date.now() + days * 86_400_000;
  const payload = `${userId}.${exp}.${productId}`;
  const token = `${Buffer.from(`${userId}.${exp}`).toString("base64url")}.${sign(payload)}`;
  return `${siteUrl}/api/download/${productId}?t=${token}`;
}

/** Returns the user the link was made for, or null if it is forged or expired. */
export function verifyDownloadToken(productId: string, token: string): string | null {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const [userId, expRaw] = Buffer.from(body, "base64url").toString().split(".");
    const exp = Number(expRaw);
    if (!userId || !Number.isFinite(exp) || exp < Date.now()) return null;
    const expected = Buffer.from(sign(`${userId}.${exp}.${productId}`));
    const given = Buffer.from(sig);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    return userId;
  } catch {
    return null;
  }
}
