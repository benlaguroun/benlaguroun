/** Endless scrolling strip of technologies. Pauses on hover. */
export function TechMarquee({ items }: { items: readonly string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee py-2" dir="ltr">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="glass flex items-center gap-2.5 !rounded-full px-5 py-2.5 font-mono text-sm text-mute transition hover:text-ink"
            aria-hidden={i >= items.length}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-iris to-aqua" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
