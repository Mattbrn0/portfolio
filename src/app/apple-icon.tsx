import { ImageResponse } from "next/og";
import { logoBlades } from "@/lib/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        <svg width="132" height="132" viewBox="-1.2 -1.2 2.4 2.4">
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
      </div>
    ),
    { ...size },
  );
}
