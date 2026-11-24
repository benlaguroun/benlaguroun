/**
 * Lessons play inside an iframe, which needs an "embed" address. This turns the
 * links people usually copy (YouTube watch pages, youtu.be, Vimeo) into embed
 * addresses and leaves any other https link as it is. Returns null when the
 * link can't be used.
 */
export function toEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.replace(/^www\./, "");
  const youtubeId = /^[\w-]{11}$/;

  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return youtubeId.test(id) ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})/)?.[1];
    return id && youtubeId.test(id) ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = url.pathname.match(/^\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return url.toString();
}
