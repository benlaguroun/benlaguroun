import Link from "next/link";
import type { ClientStatus, LeadStatus, PaymentStatus } from "@brand/db";

type Tone = "neutral" | "good" | "warn" | "bad" | "info";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-white/5 text-mute",
  good: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  warn: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  bad: "border-rose/30 bg-rose/10 text-rose",
  info: "border-aqua/30 bg-aqua/10 text-aqua",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export const leadTone: Record<LeadStatus, Tone> = { NEW: "info", READ: "neutral", REPLIED: "good", ARCHIVED: "neutral" };
export const clientTone: Record<ClientStatus, Tone> = { PROSPECT: "warn", ACTIVE: "good", PAST: "neutral" };
export const paymentTone: Record<PaymentStatus, Tone> = { PENDING: "warn", PAID: "good", REFUNDED: "bad" };

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="glass p-5">
      <p className="font-mono text-[0.68rem] uppercase tracking-wider text-mute">{label}</p>
      <p className="display mt-2 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-mute">{hint}</p>}
    </div>
  );
}

export function AdminHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="display text-3xl font-semibold">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mb-5 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
      {message}
    </p>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="glass p-10 text-center text-sm text-mute">{children}</div>;
}

/** Row of filter links, e.g. All | New | Read. */
export function Filters({
  items,
  current,
}: {
  items: { label: string; href: string; key: string }[];
  current: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {items.map((i) => (
        <Link
          key={i.key}
          href={i.href}
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            i.key === current ? "border-transparent bg-white text-void" : "border-line bg-white/5 text-mute hover:text-ink"
          }`}
        >
          {i.label}
        </Link>
      ))}
    </div>
  );
}
