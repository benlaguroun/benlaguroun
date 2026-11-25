import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { resolveLocale } from "@/i18n/resolve";
import { getAgentConfig, providerChain, providerIds, providerKey, providerModel, providers } from "@/lib/agent";
import { AdminHeading, Pill } from "@/components/admin/ui";
import { saveAgentSettings } from "../../assistant-actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ notice?: string }> };

export default async function AssistantSettingsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  await requireAdmin(locale);
  const { notice } = await searchParams;
  const config = await getAgentConfig();
  const chain = providerChain(config.provider, config.fallback);

  return (
    <>
      <Link href={`/${locale}/admin/assistant`} className="text-sm text-mute hover:text-ink">← Assistant</Link>
      <div className="mt-4">
        <AdminHeading title="Assistant settings" />
      </div>
      {notice && <p role="status" className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{notice}</p>}

      <form action={saveAgentSettings} className="glass max-w-2xl space-y-6 p-7">
        <input type="hidden" name="locale" value={locale} />

        <label className="flex items-start gap-3">
          <input type="checkbox" name="enabled" defaultChecked={config.enabled} className="mt-1 size-4" />
          <span>
            <span className="font-medium">Ben is on</span>
            <span className="block text-sm text-mute">The master switch. When off, Ben reads nothing and drafts nothing, including the "Ask Ben" button.</span>
          </span>
        </label>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Main AI service</legend>
          <div className="space-y-2">
            {providerIds.map((id) => {
              const hasKey = !!providerKey(id);
              return (
                <label key={id} className="flex items-start gap-3 rounded-xl border border-line bg-white/5 p-3">
                  <input type="radio" name="provider" value={id} defaultChecked={config.provider === id} className="mt-1 size-4" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{providers[id].label}</span>
                      <Pill tone={hasKey ? "good" : "warn"}>{hasKey ? "key set" : "no key"}</Pill>
                    </span>
                    <span className="block text-sm text-mute">{providers[id].note}</span>
                    <span className="block font-mono text-xs text-mute">model: {providerModel(id)} · {providers[id].keyEnv}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <label className="flex items-start gap-3">
            <input type="checkbox" name="fallback" defaultChecked={config.fallback} className="mt-1 size-4" />
            <span>
              <span className="font-medium">If it fails, try the others</span>
              <span className="block text-sm text-mute">
                If the main service is down, rate-limited or refuses the request, Ben automatically tries the other services that have a key, so a draft still arrives.
              </span>
            </span>
          </label>
          <p className="text-xs text-mute">
            {chain.length ? <>Ben will try, in order: <strong className="text-ink">{chain.map((c) => providers[c].label).join(" → ")}</strong></> : "No service can run yet: add at least one API key to your environment and restart the server."}
          </p>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium">Most drafts per day</span>
          <input type="number" name="dailyLimit" min={1} max={500} defaultValue={config.dailyLimit} className="field mt-1 w-32" />
          <span className="mt-1 block text-xs text-mute">A safety limit so a flood of messages can't run up a bill. Each draft costs a small amount of API credit.</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Signature added to every reply</span>
          <input name="signature" defaultValue={config.signature} maxLength={200} className="field mt-1" dir="auto" />
          <span className="mt-1 block text-xs text-mute">I recommend keeping it clear that an assistant helped write the reply. People trust that more than a hidden bot.</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Your rules for Ben</span>
          <textarea
            name="instructions"
            rows={12}
            maxLength={4000}
            defaultValue={config.instructions}
            dir="auto"
            className="field mt-1 leading-relaxed"
            placeholder={`Write in plain sentences. For example:\n- Tone: friendly and direct, no hype.\n- Offer a free 20-minute intro call on weekdays; I'll confirm the time myself.\n- For custom projects, ask about goals, deadline and budget before anything else.\n- Never give a price for custom work. Say I will send a quote after a call.\n- I work in English, French and Arabic. Mention that when it helps.\n- Never discuss refunds: send those to me.`}
          />
          <span className="mt-1 block text-xs text-mute">Ben follows these on every draft. The more specific you are, the less you will have to edit.</span>
        </label>

        <button type="submit" className="btn btn-primary">Save settings</button>
      </form>

      <div className="glass mt-6 max-w-2xl space-y-2 p-6 text-sm">
        <p className="font-medium">What Ben can and cannot do</p>
        <ul className="list-disc space-y-1 ps-5 text-mute">
          <li>He can read contact-form messages, label them, and write a draft reply.</li>
          <li>He cannot send email, refund, charge, delete or change anything. Only the "Approve and send" button you press sends a reply.</li>
          <li>He only knows your published products, prices and the refund window, plus the rules above. He is told never to invent anything else.</li>
          <li>Whatever a visitor writes is treated as text to read, never as an order. Orders only come from you.</li>
          <li>The message text is sent to the AI service you choose, so keep your privacy policy in step (it names Anthropic, OpenAI and Groq).</li>
        </ul>
      </div>
    </>
  );
}
