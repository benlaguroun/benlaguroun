"use client";

import { useRef, useState } from "react";

async function upload(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
  return data.url;
}

function UploadButton({ onUploaded, multiple }: { onUploaded: (urls: string[]) => void; multiple?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await upload(f));
      onUploaded(urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple={multiple} onChange={onChange} className="sr-only" tabIndex={-1} />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className="btn btn-glass shrink-0 !px-4">
        {busy ? "Uploading…" : multiple ? "Upload images" : "Upload image"}
      </button>
      {error && <p role="alert" className="basis-full text-xs text-rose">{error}</p>}
    </>
  );
}

/** One image address, with an Upload button and a small preview. */
export function ImageField({ name, label, defaultValue, hint }: { name: string; label: string; defaultValue?: string | null; hint?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <div className="flex flex-wrap gap-2">
        <input
          id={name}
          name={name}
          dir="ltr"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://… or upload one"
          className="field min-w-0 flex-1"
        />
        <UploadButton onUploaded={(urls) => setValue(urls[0] ?? "")} />
      </div>
      {hint && <p className="mt-1 text-xs text-mute">{hint}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-3 h-28 rounded-xl border border-line object-cover" onError={(e) => (e.currentTarget.style.display = "none")} onLoad={(e) => (e.currentTarget.style.display = "")} />
      )}
    </div>
  );
}

/** Several image addresses, one per line, with an Upload button that adds lines. */
export function GalleryField({ name, label, defaultValue, hint }: { name: string; label: string; defaultValue?: string[]; hint?: string }) {
  const [value, setValue] = useState((defaultValue ?? []).join("\n"));
  const urls = value.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <textarea id={name} name={name} dir="ltr" rows={4} value={value} onChange={(e) => setValue(e.target.value)} placeholder="One image address per line" className="field" />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <UploadButton multiple onUploaded={(added) => setValue((v) => [...v.split("\n").map((l) => l.trim()).filter(Boolean), ...added].join("\n"))} />
        <span className="text-xs text-mute">{hint ?? "The order here is the order on the page."}</span>
      </div>
      {urls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {urls.map((u, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${u}-${i}`} src={u} alt="" className="h-20 rounded-lg border border-line object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          ))}
        </div>
      )}
    </div>
  );
}
