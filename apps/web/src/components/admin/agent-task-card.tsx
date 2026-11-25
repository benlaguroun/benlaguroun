import Link from "next/link";
import { fmtDateTime } from "@/lib/admin-format";
import { categoryLabel, providers, type ProviderId } from "@/lib/agent";
import { Pill } from "@/components/admin/ui";
import { approveAndSend, handledTask, rejectTask } from "@/app/[locale]/admin/assistant-actions";

type Task = {
  id: string;
  kind: string;
  status: "PENDING" | "SENT" | "REJECTED" | "HANDLED" | "FAILED";
  instruction: string | null;
  category: string | null;
  urgency: string | null;
  language: string | null;
  summary: string | null;
  confidence: number | null;
  needsYou: string | null;
  subject: string | null;
  draft: string | null;
  finalText: string | null;
  provider: string | null;
  model: string | null;
  tokensIn: number;
  tokensOut: number;
  error: string | null;
  createdAt: Date;
  decidedAt: Date | null;
  lead: { id: string; name: string; email: string; message: string } | null;
};

const statusTone = { PENDING: "warn", SENT: "good", REJECTED: "neutral", HANDLED: "neutral", FAILED: "bad" } as const;
const statusText = {
  PENDING: "Needs your decision",
  SENT: "Sent",
  REJECTED: "Rejected",
  HANDLED: "Handled",
  FAILED: "Failed",
} as const;
const kindText: Record<string, string> = { inbound: "New message", draft: "You asked for a draft", order: "Your order" };

export function AgentTaskCard({ task: t, locale }: { task: Task; locale: string }) {
  const sure = t.confidence ?? 0;
  const sureTone = sure >= 80 ? "bg-emerald-400" : sure >= 50 ? "bg-amber-400" : "bg-rose";

  return (
    <li id={t.id} className="glass scroll-mt-24 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={statusTone[t.status]}>{statusText[t.status]}</Pill>
        {t.category && <Pill tone={t.category === "spam" ? "bad" : "info"}>{categoryLabel[t.category] ?? t.category}</Pill>}
        {t.urgency === "high" && <Pill tone="bad">Urgent</Pill>}
        {t.language && <Pill>{t.language.toUpperCase()}</Pill>}
        <Pill>{kindText[t.kind] ?? t.kind}</Pill>
        <span className="ms-auto text-xs text-mute">{fmtDateTime(t.createdAt)}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">
          {t.lead ? (
            <Link href={`/${locale}/admin/messages/${t.lead.id}`} className="hover:underline">{t.lead.name}</Link>
          ) : (
            "Message deleted"
          )}
          {t.lead && <span className="ms-2 text-sm font-normal text-mute" dir="ltr">{t.lead.email}</span>}
        </p>
        {t.confidence != null && t.status !== "FAILED" && (
          <div className="flex items-center gap-2 text-xs text-mute" title="How sure Ben is that the draft is right to send">
            <span>Ben's confidence</span>
            <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10" aria-hidden>
              <span className={`block h-full ${sureTone}`} style={{ width: `${sure}%` }} />
            </span>
            <span className="font-mono">{sure}%</span>
          </div>
        )}
      </div>

      {t.summary && <p className="mt-2 text-sm text-mute"><span className="text-ink">What Ben understood:</span> {t.summary}</p>}
      {t.instruction && <p className="mt-2 text-sm"><span className="text-mute">Your order:</span> {t.instruction}</p>}
      {t.needsYou && (
        <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          <strong>Ben needs you to decide:</strong> {t.needsYou}
        </p>
      )}
      {t.error && t.status === "FAILED" && <p className="mt-3 rounded-lg border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose">{t.error}</p>}
      {t.error && t.status !== "FAILED" && <p className="mt-3 text-xs text-amber-300">{t.error}</p>}

      {t.lead && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-aqua">Their message</summary>
          <p className="mt-2 whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-sm">{t.lead.message}</p>
        </details>
      )}

      {t.status === "PENDING" && t.draft && t.lead && (
        <div className="mt-4 border-t border-line pt-4">
          <form action={approveAndSend} className="space-y-3">
            <input type="hidden" name="id" value={t.id} />
            <input type="hidden" name="locale" value={locale} />
            <label className="block text-xs text-mute">
              Subject
              <input name="subject" defaultValue={t.subject ?? ""} maxLength={160} className="field mt-1" dir="auto" />
            </label>
            <label className="block text-xs text-mute">
              Reply to send (edit it as you like). A short signature is added when it is sent.
              <textarea name="body" defaultValue={t.draft} rows={9} maxLength={5000} className="field mt-1 leading-relaxed" dir="auto" />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary !px-4 !py-2 text-xs">Approve and send</button>
            </div>
          </form>
          <div className="mt-2 flex flex-wrap gap-2">
            <form action={rejectTask}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-glass !px-4 !py-2 text-xs">Reject draft</button>
            </form>
            <form action={handledTask}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-glass !px-4 !py-2 text-xs">I replied myself</button>
            </form>
          </div>
        </div>
      )}

      {t.status !== "PENDING" && (t.finalText || t.draft) && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-aqua">{t.finalText ? "What was sent" : "Draft that was not sent"}</summary>
          <p className="mt-2 whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-sm" dir="auto">{t.finalText ?? t.draft}</p>
        </details>
      )}

      <p className="mt-3 text-[0.7rem] text-mute">
        {t.provider ? `${providers[t.provider as ProviderId]?.label ?? t.provider} · ` : ""}{t.model ?? "no model"} · {t.tokensIn + t.tokensOut} tokens{t.decidedAt ? ` · decided ${fmtDateTime(t.decidedAt)}` : ""}
      </p>
    </li>
  );
}
