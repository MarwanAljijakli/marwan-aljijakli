"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

// `typewriter-effect` touches `document` during render — load it client-side only.
const Typewriter = dynamic(() => import("typewriter-effect"), { ssr: false });

const TYPEWRITER_PHRASES = [
  "AI/ML Engineer",
  "Computer Vision Engineer",
  "CTO",
  "LLM & RAG Systems Engineer",
] as const;

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Per-spec stagger schedule
const D_LINE_1 = 0.3;
const D_LINE_2 = 0.6;
const D_LINE_3 = 0.9;
const D_TYPE = 1.2;
const D_BTNS = 1.5;
const D_SCROLL = 2.0;

export default function HeroContent() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center">
      <div className="container-page pointer-events-auto flex w-full flex-col gap-5 md:gap-7">
        {/* ---------------------------------------------------------------- */}
        {/* Line 1 — role tag                                                */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: D_LINE_1,
            ease: EASE_OUT_EXPO,
          }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--accent-primary)]"
        >
          <span className="inline-block h-px w-10 bg-[color:var(--accent-primary)]" />
          CTO &amp; AI/ML Engineer
          <span className="ml-2 inline-flex items-center gap-1.5 text-[color:var(--text-muted)]">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-slow rounded-full bg-[color:var(--accent-primary)]" />
            Available immediately · Open to remote roles globally and KSA on-site · Zero visa friction
          </span>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Line 2 — MARWAN (filled)                                         */}
        {/* ---------------------------------------------------------------- */}
        <motion.h1
          initial={{ opacity: 0, x: -120, skewX: -6, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, skewX: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1,
            delay: D_LINE_2,
            ease: EASE_OUT_EXPO,
          }}
          className="font-display leading-[0.88] text-[color:var(--text-primary)]"
          style={{
            fontSize: "clamp(4rem, 14vw, 9rem)",
            letterSpacing: "-0.015em",
            textShadow: "0 0 40px rgba(0,212,255,0.12)",
          }}
        >
          MARWAN
        </motion.h1>

        {/* ---------------------------------------------------------------- */}
        {/* Line 3 — ALJIJAKLI (outline only)                                */}
        {/* ---------------------------------------------------------------- */}
        <motion.h1
          initial={{ opacity: 0, x: 120, skewX: 6, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, skewX: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1,
            delay: D_LINE_3,
            ease: EASE_OUT_EXPO,
          }}
          className="font-display leading-[0.88]"
          style={{
            fontSize: "clamp(4rem, 14vw, 9rem)",
            letterSpacing: "-0.015em",
            color: "transparent",
            WebkitTextStroke: "1.5px var(--accent-primary)",
            textShadow: "0 0 30px rgba(0,212,255,0.2)",
          }}
        >
          ALJIJAKLI
        </motion.h1>

        {/* ---------------------------------------------------------------- */}
        {/* Line 4 — typewriter cycle                                        */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: D_TYPE, ease: EASE_OUT_EXPO }}
          className="flex items-center gap-3 pt-2 font-mono text-[color:var(--text-secondary)]"
          style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)" }}
          data-cursor="text"
        >
          <span className="text-[color:var(--accent-primary)]">&gt;</span>
          <span className="typewriter-shell">
            <Typewriter
              options={{
                strings: [...TYPEWRITER_PHRASES],
                autoStart: true,
                loop: true,
                delay: 55,
                deleteSpeed: 28,
                cursor: "▍",
                wrapperClassName: "typewriter-wrapper",
                cursorClassName: "typewriter-cursor",
              }}
            />
          </span>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* CTAs                                                             */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: D_BTNS, ease: EASE_OUT_EXPO }}
          className="mt-6 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            data-cursor="hover"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[color:var(--accent-primary)] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--bg-primary)] transition-transform duration-300 ease-out-expo hover:scale-[1.05]"
            style={{ boxShadow: "0 0 0 rgba(0,212,255,0)" }}
          >
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[color:var(--accent-primary)] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />
            View Projects
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </a>

          <a
            href="/marwan-cv.pdf"
            download
            data-cursor="hover"
            className="group relative inline-flex items-center gap-2 rounded-full border-2 border-[color:var(--accent-primary)] bg-transparent px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--accent-primary)] transition-colors duration-300 hover:bg-[color:var(--accent-primary)] hover:text-[color:var(--bg-primary)]"
          >
            Download CV
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </a>
        </motion.div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Scroll indicator — bottom center                                   */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: D_SCROLL, ease: EASE_OUT_EXPO }}
        className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-[color:var(--accent-primary)]"
        >
          <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
        </motion.div>
      </motion.div>

      {/* Typewriter cursor styling (kept inline so this component is standalone). */}
      <style jsx global>{`
        .typewriter-wrapper {
          color: inherit;
        }
        .typewriter-cursor {
          color: var(--accent-primary);
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}
