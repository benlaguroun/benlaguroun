import { emailConfigured } from "@/lib/email";

/**
 * Buyers must confirm their email before paying, so receipts and download links
 * reach the real owner of the address. This only applies once email sending is
 * set up (otherwise nobody could ever confirm), and never to admins.
 */
export function needsVerification(user: { emailVerified?: boolean | null; role?: string | null } | null | undefined) {
  if (!user || !emailConfigured()) return false;
  if (user.role === "ADMIN") return false;
  return !user.emailVerified;
}
