"use client";

import { useRef, useState } from "react";

/**
 * The template file buyers download. It is uploaded to a private folder on the
 * server, so the address is never exposed and access is checked on every download.
 */
export function DeliveryField({ file, name }: { file?: string | null; name?: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState({ file: file ?? "", name: name ?? "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", picked);
      const res = await fetch("/api/uploads/private", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { file?: string; name?: string; error?: string };
      if (!res.ok || !data.file) throw new Error(data.error ?? "Upload failed.");
      setCurrent({ file: data.file, name: data.name ?? picked.name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="label">Template file</span>
      <input type="hidden" name="deliveryFile" value={current.file} />
      <input type="hidden" name="deliveryName" value={current.name} />
      <input ref={input} type="file" accept=".zip,.pdf,application/zip,application/pdf" onChange={onChange} className="sr-only" tabIndex={-1} />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy} onClick={() => input.current?.click()} className="btn btn-glass !px-4">
          {busy ? "Uploading…" : current.file ? "Replace file" : "Upload ZIP or PDF"}
        </button>
        {current.file && (
          <>
            <span className="min-w-0 truncate text-sm" dir="ltr">{current.name || current.file}</span>
            <button type="button" onClick={() => setCurrent({ file: "", name: "" })} className="text-xs font-medium text-rose hover:underline">
              Remove
            </button>
          </>
        )}
      </div>
      {error && <p role="alert" className="mt-1 text-xs text-rose">{error}</p>}
      <p className="mt-1 text-xs text-mute">
        Up to 100 MB. Kept in a private folder: only people who bought it can download it, and a refund cancels their access.
        Save the product after uploading.
      </p>
    </div>
  );
}
