import { headers } from "next/headers";

// A small in-memory limiter. It lives in the server process, so it resets when
// the server restarts and is not shared between several servers, which is fine
// for a single self-hosted site. Use a shared store (Redis) if you ever scale out.
const buckets = new Map<string, number[]>();

/** Counts this call and returns true when `key` has made more than `max` calls in the last `windowMs`. */
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear(); // never grow without bound
  return recent.length > max;
}

/** The visitor's address. Cloudflare passes the real one in cf-connecting-ip. */
export async function clientIp() {
  const h = await headers();
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
