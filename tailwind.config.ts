import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",

        // Accents
        accent: {
          cyan: "var(--accent-primary)",
          violet: "var(--accent-secondary)",
          orange: "var(--accent-tertiary)",
          DEFAULT: "var(--accent-primary)",
        },

        // Text
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },

        // Utility
        grid: "var(--grid-lines)",
        glow: "var(--glow)",
      },

      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
      },

      fontSize: {
        "display-xl": ["clamp(4rem, 14vw, 14rem)", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(3rem, 10vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(2.25rem, 6vw, 5rem)", { lineHeight: "1.05" }],
      },

      backgroundImage: {
        "grid-pattern":
          "linear-gradient(var(--grid-lines) 1px, transparent 1px), linear-gradient(90deg, var(--grid-lines) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at center, var(--glow) 0%, transparent 70%)",
        "accent-gradient":
          "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
      },

      backgroundSize: {
        grid: "48px 48px",
        "grid-sm": "24px 24px",
      },

      boxShadow: {
        glow: "0 0 40px var(--glow)",
        "glow-lg": "0 0 80px var(--glow)",
        "inner-glow": "inset 0 0 40px var(--glow)",
      },

      animation: {
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        marquee: "marquee 30s linear infinite",
        "cursor-blink": "blink 1s step-end infinite",
        "scan-line": "scanLine 3s linear infinite",
      },

      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-100%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },

      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
