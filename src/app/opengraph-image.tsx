import { ImageResponse } from "next/og";

export const alt = "Marwan Aljijakli — AI & Data Engineer and CTO";
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
          color: "#f4f1e8",
          background: "#0c0e0c",
          padding: "68px 72px 58px",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(244,241,232,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,232,.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(90deg, transparent 36%, black 100%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 58,
                height: 58,
                borderRadius: 29,
                color: "#0c0e0c",
                background: "#c9ff57",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.06em",
              }}
            >
              MA
            </div>
            <span style={{ fontSize: 20, letterSpacing: "0.05em" }}>MARWAN ALJIJAKLI</span>
          </div>
          <span style={{ color: "#c9ff57", fontSize: 16, letterSpacing: "0.16em" }}>JEDDAH / SA</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <span style={{ color: "#c9ff57", fontSize: 20, letterSpacing: "0.14em", marginBottom: 22 }}>
            AI & DATA ENGINEER · CTO
          </span>
          <span style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 700 }}>
            Building the intelligence layer — and the systems that carry it.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 18, color: "#a9ada5" }}>Models · Data · APIs · Product · Production</span>
          <span style={{ fontSize: 18, color: "#a9ada5" }}>marwan-aljijakli.com</span>
        </div>
      </div>
    ),
    size
  );
}
