import { ImageResponse } from "next/og";

// iOS home-screen icon, generated at build time (no binary asset checked in).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0c10",
        }}
      >
        {/* Upward triangle (momentum), drawn with borders so no font is needed. */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "42px solid transparent",
            borderRight: "42px solid transparent",
            borderBottom: "74px solid #3b82f6",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
