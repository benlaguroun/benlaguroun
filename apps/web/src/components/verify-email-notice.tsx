"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Labels = { title: string; body: string; resend: string; sending: string; sent: string; error: string };

const COOLDOWN = 60;

/** Asks the buyer to confirm their email, with a button to send the link again. */
export function VerifyEmailNotice({
  email,
  callbackURL,
  labels,
  compact,
}: {
  email: string;
  callbackURL: string;
  labels: Labels;
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  async function resend() {
    setState("sending");
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL });
    if (error) {
      setState("error");
      return;
    }
    setState("sent");
    setWait(COOLDOWN);
  }

  return (
    <div role="status" className={`rounded-xl border border-amber-300/30 bg-amber-300/10 text-sm ${compact ? "px-4 py-3" : "p-5"}`}>
      <p className="font-semibold text-amber-200">{labels.title}</p>
      <p className="mt-1 text-mute">{labels.body.replace("{email}", email)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={resend} disabled={state === "sending" || wait > 0} className="btn btn-glass !px-4 !py-2">
          {state === "sending" ? labels.sending : wait > 0 ? `${labels.resend} (${wait})` : labels.resend}
        </button>
        {state === "sent" && <span className="text-xs text-aqua">{labels.sent}</span>}
        {state === "error" && <span role="alert" className="text-xs text-rose">{labels.error}</span>}
      </div>
    </div>
  );
}
