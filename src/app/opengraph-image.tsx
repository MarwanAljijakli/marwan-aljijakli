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
          color: "#f3f0e8",
          background: "#071715",
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
              "linear-gradient(rgba(184,213,204,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(184,213,204,.08) 1px, transparent 1px)",
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
                color: "#72d7c7",
                border: "1px solid rgba(114,215,199,.5)",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.06em",
              }}
            >
              MA
            </div>
            <span style={{ fontSize: 20, letterSpacing: "0.05em" }}>MARWAN ALJIJAKLI</span>
          </div>
          <span style={{ color: "#72d7c7", fontSize: 16, letterSpacing: "0.16em" }}>JEDDAH / SA</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <span style={{ color: "#d6a36d", fontSize: 20, letterSpacing: "0.14em", marginBottom: 22 }}>
            AI & DATA ENGINEER · CTO AT BOHIO
          </span>
          <span style={{ fontSize: 72, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 700 }}>
            I build the model — and everything it needs to become a product.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#d6a36d", fontSize: 17 }}>
            <span style={{ padding: "5px 11px", border: "1px solid #d6a36d", borderRadius: 18, fontSize: 13 }}>SCE</span>
            <span>Active Member No. 1272601</span>
          </div>
          <span style={{ fontSize: 18, color: "#9bb0aa" }}>marwan-aljijakli.com</span>
        </div>
      </div>
    ),
    size
  );
}
