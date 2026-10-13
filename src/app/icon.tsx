import { ImageResponse } from "next/og";
import { logoBlades } from "@/lib/logo";

export const size = { width: 32, height: 32 };
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
          borderRadius: 8,
          background: "#0a0a0a",
        }}
      >
        <svg width="26" height="26" viewBox="-1.2 -1.2 2.4 2.4">
          {logoBlades().map((points) => (
            <polygon
              key={points}
              points={points}
              fill="#fafafa"
              stroke="#fafafa"
              strokeWidth="0.06"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    ),
    { ...size },
  );
}
