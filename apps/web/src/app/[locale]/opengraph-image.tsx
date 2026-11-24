import { ImageResponse } from "next/og";
import { site } from "@/config/site";

// The picture shown when a link to the site is shared (WhatsApp, LinkedIn, X...).
// It uses the default font, so it stays in Latin letters in every language.
export const alt = `${site.name}: Full-stack & AI engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              color: "#080913",
              background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
            }}
          >
            {site.name.charAt(0)}
          </div>
          <div style={{ fontSize: 30, color: "#a5b4fc" }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>Full-stack & AI engineer</div>
          <div style={{ marginTop: 28, fontSize: 34, color: "#94a3b8" }}>
            AI-powered platforms · Templates · Business courses
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#67e8f9" }}>
          <span>EN</span>
          <span>·</span>
          <span>FR</span>
          <span>·</span>
          <span>AR</span>
        </div>
      </div>
    ),
    size,
  );
}
