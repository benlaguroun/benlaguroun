import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/config";

// Shared look for the share-preview pictures of products and posts (WhatsApp,
// LinkedIn, X ...). The built-in image font has no Arabic letters, so Arabic pages
// use the English title on the card instead of showing empty boxes.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Arabic pages fall back to English text on the card; French and English are drawn as they are. */
export const ogLocale = (raw: string): Locale => (isLocale(raw) && raw !== "ar" ? raw : "en");

/** Long titles are shortened so they never overflow the card. */
const clamp = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

export function ogCard(opts: { kicker: string; title: string; subtitle?: string; badge?: string }) {
  const title = clamp(opts.title, 80);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: "white",
          background: "linear-gradient(135deg, #1e1146 0%, #080913 55%, #0b3a4a 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
                color: "#080913",
                background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
              }}
            >
              {site.name.charAt(0)}
            </div>
            <div style={{ fontSize: 28, color: "#a5b4fc" }}>{site.name}</div>
          </div>
          <div style={{ fontSize: 26, color: "#67e8f9", textTransform: "uppercase", letterSpacing: 3 }}>{opts.kicker}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: title.length > 48 ? 60 : 76, fontWeight: 700, lineHeight: 1.08 }}>{title}</div>
          {opts.subtitle ? (
            <div style={{ marginTop: 26, fontSize: 32, lineHeight: 1.3, color: "#94a3b8" }}>{clamp(opts.subtitle, 120)}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#e2e8f0" }}>
          {opts.badge ? (
            <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "rgba(139,92,246,0.35)", border: "1px solid #8b5cf6" }}>
              {opts.badge}
            </div>
          ) : null}
        </div>
      </div>
    ),
    ogSize,
  );
}
