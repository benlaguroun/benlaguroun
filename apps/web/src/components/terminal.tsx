/**
 * Decorative terminal window for the hero. The lines appear one after another
 * (CSS animation, see .t-line). Always left-to-right because it's code.
 */
const lines = [
  { c: "text-ink", t: "$ turbo run dev" },
  { c: "text-emerald-300", t: "✓ postgres      :5432   ready" },
  { c: "text-emerald-300", t: "✓ ai-node       :8080   local models online" },
  { c: "text-emerald-300", t: "✓ web           http://192.168.1.20:3000" },
  { c: "text-aqua", t: "→ 3 devices connected over LAN" },
];

export function Terminal() {
  return (
    <div className="glass overflow-hidden" dir="ltr">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ms-3 font-mono text-xs text-mute">~/lab, zsh</span>
        <span className="ms-auto flex items-center gap-2 font-mono text-[0.68rem] text-emerald-300">
          <span className="live-dot" /> LAN
        </span>
      </div>
      <div className="space-y-2 p-5 font-mono text-[0.8rem] leading-relaxed">
        {lines.map((l, i) => (
          <p key={l.t} className={`t-line ${l.c}`} style={{ animationDelay: `${0.5 + i * 0.7}s` }}>
            {l.t}
          </p>
        ))}
        <p className="t-line text-ink" style={{ animationDelay: `${0.5 + lines.length * 0.7}s` }}>
          $ <span className="caret" />
        </p>
      </div>
    </div>
  );
}
