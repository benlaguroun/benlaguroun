type Field = { key: string; label: string; rows?: number; list?: boolean };

/**
 * French and Arabic versions of the same fields, tucked into a section that
 * stays closed until opened. Empty boxes fall back to English on the site.
 */
export function TranslationFields({
  fields,
  translations,
}: {
  fields: Field[];
  translations: unknown;
}) {
  const tr = (translations ?? {}) as Record<string, Record<string, unknown>>;
  const value = (loc: string, f: Field) => {
    const v = tr[loc]?.[f.key];
    return Array.isArray(v) ? v.join("\n") : typeof v === "string" ? v : "";
  };

  return (
    <details className="rounded-xl border border-line bg-white/[0.03] p-4">
      <summary className="cursor-pointer text-sm font-medium">French and Arabic versions (optional)</summary>
      <p className="mt-2 text-xs text-mute">Leave a box empty and visitors in that language see the English text instead.</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {(["fr", "ar"] as const).map((loc) => (
          <div key={loc} className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-wider text-aqua">{loc === "fr" ? "Français" : "العربية"}</p>
            {fields.map((f) => (
              <div key={f.key}>
                <label htmlFor={`${loc}_${f.key}`} className="label">
                  {f.label}
                  {f.list ? " (one per line)" : ""}
                </label>
                {f.rows ? (
                  <textarea
                    id={`${loc}_${f.key}`}
                    name={`${loc}_${f.key}`}
                    rows={f.rows}
                    dir={loc === "ar" ? "rtl" : "ltr"}
                    defaultValue={value(loc, f)}
                    className="field"
                  />
                ) : (
                  <input
                    id={`${loc}_${f.key}`}
                    name={`${loc}_${f.key}`}
                    dir={loc === "ar" ? "rtl" : "ltr"}
                    defaultValue={value(loc, f)}
                    className="field"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </details>
  );
}
