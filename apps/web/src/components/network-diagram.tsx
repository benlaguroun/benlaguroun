type Labels = { dev: string; apps: string; ai: string; db: string; devices: string };

const W = 184;
const H = 60;

// Node centres on a 760 x 380 canvas
const pos = {
  dev: { x: 110, y: 80, color: "#8b5cf6" },
  ai: { x: 110, y: 300, color: "#22d3ee" },
  apps: { x: 380, y: 190, color: "#f472b6" },
  db: { x: 650, y: 80, color: "#34d399" },
  devices: { x: 650, y: 300, color: "#fbbf24" },
} as const;

// Links drawn from each node to the app server in the middle
const links = [
  "M202 80 C 270 80, 230 190, 288 190", // dev -> apps
  "M202 300 C 270 300, 230 190, 288 190", // ai -> apps
  "M472 190 C 530 190, 490 80, 558 80", // apps -> db
  "M472 190 C 530 190, 490 300, 558 300", // apps -> devices
];

/**
 * Animated picture of a local network: dev machine, AI node, app server,
 * database and real devices, with data packets travelling between them.
 */
export function NetworkDiagram({ labels }: { labels: Labels }) {
  const nodes = (Object.keys(pos) as (keyof typeof pos)[]).map((key) => ({ key, ...pos[key] }));

  return (
    <svg viewBox="0 0 760 380" className="h-auto w-full" role="img" aria-label={Object.values(labels).join(", ")}>
      <defs>
        <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Links */}
      {links.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="2" />
          <path d={d} fill="none" stroke="url(#flow-grad)" strokeWidth="2" strokeLinecap="round" className="flow" />
          <circle r="4" fill="#67e8f9" filter="url(#soft-glow)">
            <animateMotion dur={`${3 + i * 0.6}s`} repeatCount="indefinite" path={d} />
          </circle>
          <circle r="2.5" fill="#fff">
            <animateMotion dur={`${3 + i * 0.6}s`} repeatCount="indefinite" path={d} />
          </circle>
        </g>
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={n.key} className="node-float" style={{ animationDelay: `${i * -1.4}s` }}>
          {n.key === "apps" && (
            <rect
              className="ring"
              x={n.x - W / 2}
              y={n.y - H / 2}
              width={W}
              height={H}
              rx="18"
              fill="none"
              stroke={n.color}
              strokeWidth="1.5"
            />
          )}
          <rect
            x={n.x - W / 2}
            y={n.y - H / 2}
            width={W}
            height={H}
            rx="18"
            fill="rgb(255 255 255 / 0.06)"
            stroke="rgb(255 255 255 / 0.16)"
          />
          <circle cx={n.x - W / 2 + 22} cy={n.y} r="6" fill={n.color} />
          <circle cx={n.x - W / 2 + 22} cy={n.y} r="11" fill={n.color} opacity="0.2" />
          <text
            x={n.x - W / 2 + 40}
            y={n.y + 5}
            fill="#eef1ff"
            fontSize="13.5"
            fontWeight="600"
            textAnchor="start"
            direction="ltr"
            style={{ unicodeBidi: "plaintext" }}
          >
            {labels[n.key]}
          </text>
        </g>
      ))}
    </svg>
  );
}
