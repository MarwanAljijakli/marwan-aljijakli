import { ImageResponse } from "next/og";

const copy = {
  name: "Marwan Aljijakli",
  location: "Jeddah, Saudi Arabia",
  role: "AI & DATA ENGINEER · CTO AT BOHIO",
  title: "AI systems, built from prototype to production.",
  credential: "Active engineering member · No. 1272601",
} as const;

export function createOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        lang="en"
        dir="ltr"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#f4f0e7",
          background: "#071310",
          padding: "62px 68px 54px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 620,
            height: 620,
            top: -290,
            display: "flex",
            borderRadius: 620,
            border: "1px solid rgba(114,216,199,.26)",
            boxShadow: "0 0 160px rgba(114,216,199,.12)",
            right: -210,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 54,
                height: 54,
                borderRadius: 27,
                color: "#dda567",
                border: "1px solid rgba(221,165,103,.55)",
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              MA
            </div>
            <span style={{ fontSize: 20, fontWeight: 600 }}>{copy.name}</span>
          </div>
          <span style={{ color: "#72d8c7", fontSize: 16 }}>{copy.location}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 990 }}>
          <span style={{ color: "#dda567", fontSize: 19, marginBottom: 20 }}>
            {copy.role}
          </span>
          <span
            style={{
              fontSize: 62,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              fontWeight: 600,
            }}
          >
            {copy.title}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, color: "#c5d0ca", fontSize: 16 }}>
            <span
              style={{
                padding: "5px 11px",
                border: "1px solid rgba(221,165,103,.7)",
                borderRadius: 18,
                color: "#dda567",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              SCE
            </span>
            <span>{copy.credential}</span>
          </div>
          <span style={{ fontSize: 17, color: "#90a49b" }}>marwan-aljijakli.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
