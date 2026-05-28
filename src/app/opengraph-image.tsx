import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Marwan Aljijakli — AI/ML Engineer & CTO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #050A0F 0%, #0D1B2A 50%, #0A0F1A 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 65%)",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #00D4FF 30%, #7B2FBE 70%, transparent)",
          }}
        />

        {/* Available badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#10dc78",
              boxShadow: "0 0 16px #10dc78",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 16,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#5ef5a6",
            }}
          >
            Available Immediately
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            marginBottom: 24,
          }}
        >
          MARWAN
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            color: "transparent",
            WebkitTextStroke: "2px #00D4FF",
            marginBottom: 40,
          }}
        >
          ALJIJAKLI
        </div>

        {/* Role tags */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["AI/ML Engineer", "Computer Vision", "LLM & RAG Systems", "CTO"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,212,255,0.35)",
                  background: "rgba(0,212,255,0.08)",
                  fontFamily: "monospace",
                  fontSize: 15,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#00D4FF",
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          marwan-aljijakli.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
