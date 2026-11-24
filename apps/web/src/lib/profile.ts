import { existsSync } from "node:fs";
import path from "node:path";

const candidates = ["profile.jpg", "profile.jpeg", "profile.png", "profile.webp"];

/**
 * Looks for your photo in apps/web/public (profile.jpg, .jpeg, .png or .webp).
 * Returns its public URL, or null so the site can show a placeholder instead.
 */
export function getProfilePhoto(): string | null {
  for (const file of candidates) {
    if (existsSync(path.join(process.cwd(), "public", file))) return `/${file}`;
  }
  return null;
}

const aboutCandidates = ["about.jpg", "about.jpeg", "about.png", "about.webp"];

/**
 * The second portrait used on the About page: apps/web/public/about.(jpg|png|webp).
 * Falls back to the main profile photo until you add one.
 */
export function getAboutPhoto(): string | null {
  for (const file of aboutCandidates) {
    if (existsSync(path.join(process.cwd(), "public", file))) return `/${file}`;
  }
  return getProfilePhoto();
}
