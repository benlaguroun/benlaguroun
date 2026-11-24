import type { ProductType } from "@brand/db";

type P = { className?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Arrow that points "forward": flips automatically in right-to-left languages. */
export function Arrow({ className = "" }: P) {
  return (
    <svg {...base} className={`h-4 w-4 rtl:-scale-x-100 ${className}`}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowBack({ className = "" }: P) {
  return (
    <svg {...base} className={`h-4 w-4 rtl:-scale-x-100 ${className}`}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function Check({ className = "" }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Lock({ className = "" }: P) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

export function Globe({ className = "" }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}

export function Menu({ className = "" }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close({ className = "" }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function TypeIcon({ type, className = "" }: { type: ProductType } & P) {
  if (type === "SERVICE") {
    return (
      <svg {...base} className={className}>
        <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
      </svg>
    );
  }
  if (type === "TEMPLATE") {
    return (
      <svg {...base} className={className}>
        <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" transform="translate(0 -1)" />
      </svg>
    );
  }
  return (
    <svg {...base} className={className}>
      <path d="M2 9l10-5 10 5-10 5L2 9zM6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
    </svg>
  );
}
