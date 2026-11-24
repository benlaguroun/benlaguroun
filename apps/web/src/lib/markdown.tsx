import type { ReactNode } from "react";

// A small Markdown renderer for blog posts. It builds React elements directly
// (never raw HTML), so nothing a post contains can run as a script. Supported:
//   ## Heading   ### Sub-heading   - bullet   1. numbered   > quote
//   ```code block```   ![alt](image-url)   **bold**   *italic*   `code`   [text](link)

/** Only web links, site-relative links and email links are allowed. */
function safeHref(href: string) {
  if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) return href;
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  return null;
}
const isExternal = (href: string) => /^https?:\/\//i.test(href);

const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\s][^*\n]*\*)|(\[[^\]\n]+\]\([^)\s]+\))/g;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(INLINE)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const token = m[0];
    const k = `${key}-${n++}`;
    if (m[1]) {
      out.push(<code key={k} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em]" dir="ltr">{token.slice(1, -1)}</code>);
    } else if (m[2]) {
      out.push(<strong key={k} className="font-semibold text-ink">{inline(token.slice(2, -2), k)}</strong>);
    } else if (m[3]) {
      out.push(<em key={k}>{inline(token.slice(1, -1), k)}</em>);
    } else {
      const label = token.slice(1, token.indexOf("]("));
      const href = safeHref(token.slice(token.indexOf("](") + 2, -1));
      out.push(
        href ? (
          <a
            key={k}
            href={href}
            className="text-aqua underline underline-offset-2 hover:no-underline"
            {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>
        ) : (
          label
        ),
      );
    }
    last = i + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Turns a post body into elements. */
export function renderMarkdown(source: string): ReactNode[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  const isBlockStart = (l: string) => /^(#{2,3} |[-*] |\d+\. |> |```|!\[)/.test(l);

  while (i < lines.length) {
    const line = lines[i] ?? "";
    const key = `b${k++}`;

    if (!line.trim()) { i++; continue; }

    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) code.push(lines[i++] ?? "");
      i++; // closing fence
      blocks.push(
        <pre key={key} dir="ltr" className="overflow-x-auto rounded-xl border border-line bg-black/40 p-4 text-sm leading-relaxed">
          <code className="font-mono">{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = /^(#{2,3}) (.+)$/.exec(line);
    if (heading) {
      const text = heading[2] ?? "";
      blocks.push(
        heading[1] === "##" ? (
          <h2 key={key} className="display mt-12 text-2xl font-semibold sm:text-3xl">{inline(text, key)}</h2>
        ) : (
          <h3 key={key} className="display mt-8 text-xl font-semibold">{inline(text, key)}</h3>
        ),
      );
      i++;
      continue;
    }

    const image = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/.exec(line);
    if (image) {
      const src = image[2] ?? "";
      if (/^https:\/\//i.test(src) || (src.startsWith("/") && !src.startsWith("//"))) {
        blocks.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img key={key} src={src} alt={image[1] ?? ""} loading="lazy" className="my-8 w-full rounded-2xl border border-line" />,
        );
      }
      i++;
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i] ?? "")) {
        items.push(<li key={`${key}-${i}`}>{inline((lines[i] ?? "").slice(2), `${key}-${i}`)}</li>);
        i++;
      }
      blocks.push(<ul key={key} className="list-disc space-y-2 ps-6 marker:text-aqua">{items}</ul>);
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i] ?? "")) {
        items.push(<li key={`${key}-${i}`}>{inline((lines[i] ?? "").replace(/^\d+\. /, ""), `${key}-${i}`)}</li>);
        i++;
      }
      blocks.push(<ol key={key} className="list-decimal space-y-2 ps-6 marker:text-aqua">{items}</ol>);
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && (lines[i] ?? "").startsWith("> ")) quote.push((lines[i++] ?? "").slice(2));
      blocks.push(
        <blockquote key={key} className="border-s-2 border-aqua/60 ps-5 italic text-mute">
          {inline(quote.join(" "), key)}
        </blockquote>,
      );
      continue;
    }

    // A paragraph runs until a blank line or the start of another block.
    const para: string[] = [];
    while (i < lines.length && (lines[i] ?? "").trim() && !(para.length && isBlockStart(lines[i] ?? ""))) {
      para.push((lines[i++] ?? "").trim());
    }
    blocks.push(<p key={key}>{inline(para.join(" "), key)}</p>);
  }
  return blocks;
}

/** Rough reading time in minutes (about 200 words a minute). */
export function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
