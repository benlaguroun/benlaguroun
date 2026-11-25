import Link from "next/link";
import { prisma } from "@brand/db";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { agentConfigured, getAgentConfig, providerChain, providers, runsToday } from "@/lib/agent";
import { emailConfigured } from "@/lib/email";
import { fmtDateTime } from "@/lib/admin-format";
import { AdminHeading, Empty, ErrorBanner, Filters, Pill, StatCard } from "@/components/admin/ui";
import { AgentTaskCard } from "@/components/admin/agent-task-card";
import { askBen, setAgentEnabled } from "../assistant-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ show?: string; notice?: string; error?: string }>;
};

export default async function AdminAssistantPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { show, notice, error } = await searchParams;
  const filter = show === "log" ? "log" : "waiting";
  const base = `/${locale}/admin/assistant`;

  let config, tasks, waiting, sent, today, leads;
  try {
    [config, waiting, sent, today, tasks, leads] = await Promise.all([
      getAgentConfig(),
      prisma.agentTask.count({ where: { status: "PENDING" } }),
      prisma.agentTask.count({ where: { status: "SENT" } }),
      runsToday(),
      prisma.agentTask.findMany({
        where: filter === "waiting" ? { status: "PENDING" } : {},
        orderBy: { createdAt: "desc" },
        take: 60,
        include: { lead: { select: { id: true, name: true, email: true, message: true } } },
      }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 30, select: { id: true, name: true, message: true, createdAt: true } }),
    ]);
  } catch {
    return (
      <>
        <AdminHeading title="Assistant" />
        <p role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
          Ben needs one database update first. Run <code>npm run db:generate</code> and <code>npm run db:push</code>, then reload this page.
        </p>
      </>
    );
  }

  const keyOk = agentConfigured();
  const chain = providerChain(config.provider, config.fallback);
  const mailOk = emailConfigured();

  return (
    <>
      <AdminHeading title="Assistant">
        <Link href={`${base}/settings`} className="btn btn-glass !px-4 !py-2">Settings</Link>
      </AdminHeading>

      {notice && <p role="status" className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{notice}</p>}
      <ErrorBanner message={error} />

      <div className="glass mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <span aria-hidden className="grid size-12 place-items-center rounded-full bg-iris/30 font-display text-xl font-bold">B</span>
          <div>
            <p className="display text-lg font-semibold">
              Ben <span className="text-sm font-normal text-mute">· AI assistant</span>
            </p>
            <p className="text-sm text-mute">
              Reads your messages, understands them, and drafts replies. Nothing is sent until you approve it.
            </p>
          </div>
        </div>
        <form action={setAgentEnabled} className="flex items-center gap-3">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="enabled" value={config.enabled ? "0" : "1"} />
          <Pill tone={config.enabled ? "good" : "neutral"}>{config.enabled ? "On" : "Off"}</Pill>
          <button type="submit" className={`btn !px-4 !py-2 ${config.enabled ? "btn-glass" : "btn-primary"}`}>
            {config.enabled ? "Switch off" : "Switch on"}
          </button>
        </form>
      </div>

      {(!keyOk || !mailOk) && (
        <ul className="mb-6 space-y-2 text-sm">
          {!keyOk && (
            <li className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-amber-200">
              Ben can't think yet: add <code>ANTHROPIC_API_KEY</code>, <code>OPENAI_API_KEY</code> or <code>GROQ_API_KEY</code> to your environment and restart the server.
            </li>
          )}
          {!mailOk && (
            <li className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-amber-200">
              Email isn't set up (<code>BREVO_API_KEY</code>, <code>EMAIL_FROM</code>), so you can read drafts but not send them.
            </li>
          )}
        </ul>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Waiting for you" value={String(waiting)} hint="Drafts to review" />
        <StatCard label="Replies sent" value={String(sent)} hint="Approved by you" />
        <StatCard label="Drafts today" value={`${today} / ${config.dailyLimit}`} hint={chain.length ? `Using ${chain.map((c) => providers[c].label.split(" ")[0]).join(" → ")}` : "No AI key set"} />
      </div>

      <section className="glass mb-8 p-6" aria-labelledby="order">
        <h2 id="order" className="display text-lg font-semibold">Give Ben an order</h2>
        <p className="mt-1 text-sm text-mute">
          Pick a message and, if you like, tell Ben what to do with it ("offer a call on Thursday afternoon", "say no politely, we don't do that").
          Leave the order empty and Ben just drafts his own reply. Either way you approve it before it goes out.
        </p>
        {leads.length === 0 ? (
          <p className="mt-4 text-sm text-mute">No messages yet. Once someone writes through the contact form, you can choose it here.</p>
        ) : (
          <form action={askBen} className="mt-4 space-y-3">
            <input type="hidden" name="locale" value={locale} />
            <label className="block text-xs text-mute">
              Message
              <select name="leadId" required className="field mt-1" defaultValue="">
                <option value="" disabled>Choose a message…</option>
                {leads.map((l: { id: string; name: string; message: string; createdAt: Date }) => (
                  <option key={l.id} value={l.id}>
                    {l.name} · {fmtDateTime(l.createdAt)} · {l.message.slice(0, 50).replace(/\s+/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-mute">
              Your order (optional)
              <textarea name="instruction" rows={3} maxLength={1500} className="field mt-1" dir="auto" placeholder="e.g. Offer a 30-minute call on Thursday afternoon and ask what their deadline is." />
            </label>
            <button type="submit" disabled={!config.enabled || !keyOk} className="btn btn-primary !px-4 !py-2 text-xs disabled:opacity-50">
              Ask Ben to draft
            </button>
            {(!config.enabled || !keyOk) && <p className="text-xs text-mute">Switch Ben on and add the API key first.</p>}
          </form>
        )}
      </section>

      <Filters
        current={filter}
        items={[
          { key: "waiting", label: `Needs your decision (${waiting})`, href: base },
          { key: "log", label: "Activity log", href: `${base}?show=log` },
        ]}
      />

      {tasks.length === 0 ? (
        <Empty>{filter === "waiting" ? "Nothing waiting for you. Ben will drop new drafts here." : "Ben hasn't done anything yet."}</Empty>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t: Parameters<typeof AgentTaskCard>[0]["task"]) => (
            <AgentTaskCard key={t.id} task={t} locale={locale} />
          ))}
        </ul>
      )}
    </>
  );
}
