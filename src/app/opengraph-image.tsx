import { ImageResponse } from "next/og";
import { logoBlades } from "@/lib/logo";

export const alt = "Mathis Bricman — Développeur web à Marseille";
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
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "#fafafa",
          color: "#0a0a0a",
        }}
      >
        <svg width="260" height="260" viewBox="-1.2 -1.2 2.4 2.4">
          {logoBlades().map((points) => (
            <polygon
              key={points}
              points={points}
              fill="#0a0a0a"
              stroke="#0a0a0a"
              strokeWidth="0.028"
              strokeLinejoin="round"
            />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>
            Mathis Bricman
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#555555" }}>
            Développeur web · Marseille
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
