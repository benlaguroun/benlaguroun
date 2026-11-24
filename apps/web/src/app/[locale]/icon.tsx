import { ImageResponse } from "next/og";
import { site } from "@/config/site";

// Browser-tab icon: the same gradient monogram used in the header.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 700,
          color: "#080913",
          borderRadius: 16,
          background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
        }}
      >
        {site.name.charAt(0)}
      </div>
    ),
    size,
  );
}
