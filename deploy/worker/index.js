// Cloudflare Worker: keeps benlaguroun.com presentable when the origin (your Mac) is off.
//
// How it works
//  1. Every request goes to your real server first (through the tunnel).
//  2. When the server answers normally, public pages and their files (CSS, JS, images)
//     are also saved as an offline copy in Cloudflare's cache, in the location that served them.
//  3. When the server is off, asleep or erroring (any 5xx, or no answer in 8 seconds),
//     visitors get the saved copy of that page, or a friendly "back shortly" page if there is none.
//
// Pages that must run on the server are never copied and never faked: admin, login, signup,
// dashboard, learn, checkout, password pages, /api and form posts. While the server is off
// they show the "back shortly" page, with your email address.
//
// Optional variables (Workers -> Settings -> Variables): CONTACT_EMAIL and SITE_NAME.

const HTML_TTL = 60 * 60 * 24 * 7; // keep offline copies of pages for 7 days
const ASSET_TTL = 60 * 60 * 24 * 30; // and of files for 30 days
const TIMEOUT_MS = 8000;

const PRIVATE = /^\/(?:(?:en|fr|ar)\/)?(?:admin|login|signup|dashboard|learn|checkout|forgot-password|reset-password|unsubscribe)(?:\/|$)/;
const ASSET = /^\/_next\/(?:static|image)(?:\/|$)/;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Self-check: https://yourdomain/__offline/check?path=/en tells you if a copy is saved.
    if (url.pathname === "/__offline/check") return checkCopy(url);

    let response = null;
    try {
      response = await fetch(request, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch {
      response = null;
    }

    const up = response !== null && response.status < 500;
    const isRead = request.method === "GET" || request.method === "HEAD";
    const isApp =
      PRIVATE.test(url.pathname) ||
      url.pathname.startsWith("/api/") ||
      request.headers.has("rsc") ||
      request.headers.has("next-router-prefetch") ||
      url.searchParams.has("_rsc");

    // Things that must run on the server: pass the real answer through, or say we are away.
    // Cloudflare answers 520-530 (for example 1033) or 502/504 when it cannot reach the server.
    if (!isRead || isApp) {
      const unreachable =
        response === null || (response.status >= 520 && response.status <= 530) || response.status === 502 || response.status === 504;
      return unreachable ? offlinePage(request, env) : response;
    }

    const key = cacheKey(url);
    const cache = caches.default;
    const isAsset = ASSET.test(url.pathname);

    if (up) {
      const signedIn = /session_token/.test(request.headers.get("cookie") || "");
      const type = response.headers.get("content-type") || "";
      if (request.method === "GET" && response.status === 200 && !signedIn && (isAsset || type.includes("text/html"))) {
        ctx.waitUntil(save(cache, key, response.clone(), isAsset ? ASSET_TTL : HTML_TTL));
      }
      return response;
    }

    // The server is down. Send the bare address to the default language.
    if (url.pathname === "/") return Response.redirect(`${url.origin}/en`, 302);

    const copy = await cache.match(key);
    if (copy) {
      const headers = new Headers(copy.headers);
      headers.set("cache-control", "no-store");
      headers.set("x-served-from", "offline-copy");
      return new Response(request.method === "HEAD" ? null : copy.body, { status: 200, headers });
    }
    return offlinePage(request, env);
  },
};

function cacheKey(url) {
  return new Request(`${url.origin}${url.pathname}${url.search}`, { method: "GET" });
}

const ERROR_KEY = new Request("https://offline.invalid/last-error", { method: "GET" });

async function save(cache, key, response, ttl) {
  try {
    const headers = new Headers(response.headers);
    // Headers that stop Cloudflare's cache from storing or matching the copy.
    for (const name of ["set-cookie", "content-encoding", "content-length", "transfer-encoding", "vary", "etag", "last-modified", "age"]) {
      headers.delete(name);
    }
    headers.set("cache-control", `public, max-age=${ttl}`);
    headers.set("x-offline-saved-at", new Date().toISOString());
    await cache.put(key, new Response(response.body, { status: 200, headers }));
  } catch (error) {
    // Remember why saving failed, so /__offline/check can show it.
    const message = `${new Date().toISOString()} ${key.url} ${error && error.message ? error.message : error}`;
    await cache.put(ERROR_KEY, new Response(message, { headers: { "cache-control": "public, max-age=86400" } }));
  }
}

async function checkCopy(url) {
  const cache = caches.default;
  const path = url.searchParams.get("path") || "/en";
  const target = new URL(path, url.origin);
  const copy = await cache.match(cacheKey(target));
  const failure = await cache.match(ERROR_KEY);
  const body = {
    path: `${target.pathname}${target.search}`,
    saved: Boolean(copy),
    savedAt: copy ? copy.headers.get("x-offline-saved-at") : null,
    lastSaveError: failure ? await failure.text() : null,
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}

const text = {
  en: {
    dir: "ltr",
    title: "Back shortly",
    body: "This page is temporarily unavailable. Please try again in a few minutes.",
    mail: "Or write to us at",
    retry: "Try again",
  },
  fr: {
    dir: "ltr",
    title: "Bientôt de retour",
    body: "Cette page est temporairement indisponible. Merci de réessayer dans quelques minutes.",
    mail: "Ou écrivez-nous à",
    retry: "Réessayer",
  },
  ar: {
    dir: "rtl",
    title: "نعود قريبًا",
    body: "هذه الصفحة غير متاحة مؤقتًا. يرجى المحاولة مرة أخرى بعد دقائق.",
    mail: "أو راسلنا على",
    retry: "حاول مرة أخرى",
  },
};

function pickLanguage(request) {
  const first = new URL(request.url).pathname.split("/")[1];
  if (first === "fr" || first === "ar" || first === "en") return first;
  const accept = (request.headers.get("accept-language") || "").toLowerCase();
  if (accept.startsWith("fr")) return "fr";
  if (accept.startsWith("ar")) return "ar";
  return "en";
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function offlinePage(request, env) {
  const lang = pickLanguage(request);
  const t = text[lang];
  const name = esc(env.SITE_NAME || "Ben Laguroun");
  const email = env.CONTACT_EMAIL ? esc(env.CONTACT_EMAIL) : "";
  const wantsHtml = (request.headers.get("accept") || "").includes("text/html");

  const headers = { "cache-control": "no-store", "retry-after": "300" };
  if (!wantsHtml) {
    return new Response("Service temporarily unavailable", { status: 503, headers: { ...headers, "content-type": "text/plain; charset=utf-8" } });
  }

  const html = `<!doctype html>
<html lang="${lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${t.title} · ${name}</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#0b0d14;color:#eef0f6;font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
  main{max-width:34rem;text-align:center}
  .brand{letter-spacing:.14em;text-transform:uppercase;font-size:.8rem;color:#9aa3b8}
  h1{margin:.6rem 0 .4rem;font-size:2.6rem;line-height:1.1;background:linear-gradient(90deg,#8b7cff,#35e0d0);-webkit-background-clip:text;background-clip:text;color:transparent}
  p{margin:.6rem 0;color:#c4cadb}
  a{color:#35e0d0}
  .btn{display:inline-block;margin-top:1.2rem;padding:.7rem 1.4rem;border-radius:999px;border:1px solid #2a3046;color:#eef0f6;text-decoration:none}
</style>
</head>
<body>
<main>
  <div class="brand">${name}</div>
  <h1>${t.title}</h1>
  <p>${t.body}</p>
  ${email ? `<p>${t.mail} <a href="mailto:${email}">${email}</a></p>` : ""}
  <a class="btn" href="">${t.retry}</a>
</main>
</body>
</html>`;

  return new Response(html, { status: 503, headers: { ...headers, "content-type": "text/html; charset=utf-8" } });
}
