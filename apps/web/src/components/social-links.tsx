import { activeSocial, type SocialKey } from "@/config/site";
import { Arrow } from "./icons";

const paths: Record<SocialKey, string> = {
  github:
    "M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  facebook:
    "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.88v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z",
};

/** Real brand glyph, inherits the current text colour. */
export function SocialGlyph({ k, className = "h-5 w-5" }: { k: SocialKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d={paths[k]} />
    </svg>
  );
}

function Mark({ k, size = "h-10 w-10" }: { k: SocialKey; size?: string }) {
  return (
    <span
      aria-hidden
      className={`glass grid shrink-0 place-items-center !rounded-xl text-ink transition hover:text-aqua ${size}`}
    >
      <SocialGlyph k={k} className={size.includes("12") ? "h-6 w-6" : "h-5 w-5"} />
    </span>
  );
}

/** Compact row of round buttons, used in the hero. */
export function SocialIcons() {
  const items = activeSocial();
  if (items.length === 0) return null;
  return (
    <ul className="flex items-center gap-2.5">
      {items.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer me"
            aria-label={s.label}
            title={s.label}
            className="block transition hover:-translate-y-1 hover:scale-105"
          >
            <Mark k={s.key} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Larger glass cards with a description, used on the About page. */
export function SocialCards({ descriptions }: { descriptions: Record<SocialKey, string> }) {
  const items = activeSocial();
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {items.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer me"
            className="glass spot group flex h-full items-center gap-4 p-5"
          >
            <Mark k={s.key} size="h-12 w-12" />
            <span className="min-w-0 flex-1">
              <span className="display block text-lg font-semibold">{s.label}</span>
              <span className="block truncate text-sm text-mute">{descriptions[s.key]}</span>
            </span>
            <Arrow className="text-aqua transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </a>
        </li>
      ))}
    </ul>
  );
}

