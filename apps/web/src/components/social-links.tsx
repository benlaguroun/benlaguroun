import { activeSocial, type SocialKey } from "@/config/site";
import { Arrow } from "./icons";

// Simple lettermarks keep this dependency-free and on-brand.
const mark: Record<SocialKey, { glyph: string; tone: string }> = {
  github: { glyph: "</>", tone: "from-slate-500 to-slate-700" },
  linkedin: { glyph: "in", tone: "from-sky-500 to-blue-700" },
  facebook: { glyph: "f", tone: "from-blue-500 to-indigo-700" },
};

function Mark({ k, size = "h-10 w-10" }: { k: SocialKey; size?: string }) {
  return (
    <span
      aria-hidden
      dir="ltr"
      className={`grid shrink-0 place-items-center rounded-xl bg-gradient-to-br font-mono text-sm font-bold text-white shadow-lg ${size} ${mark[k].tone}`}
    >
      {mark[k].glyph}
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

