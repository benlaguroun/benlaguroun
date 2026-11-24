import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

// Every page lives under /en, /fr or /ar. Visits without a prefix are sent to
// the visitor's saved language, then their browser language, then English.
function pickLocale(req: NextRequest) {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(saved)) return saved;

  const accept = req.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (images, icons...).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
