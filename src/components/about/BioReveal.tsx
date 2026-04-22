"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useMemo, useRef } from "react";

/* ==========================================================================
 * BioReveal
 * --------------------------------------------------------------------------
 * Reveals the bio paragraph word-by-word as it scrolls into view. Key tokens
 * ("Computer Vision", "Generative AI", "production") are highlighted in
 * cyan to anchor the eye; sentence endings get a small line break.
 * ========================================================================== */

const BIO = `Results-driven CTO and AI/ML Engineer with hands-on expertise spanning §Computer Vision§, §Generative AI§, §LLM applications§, and §production-grade§ AI system deployment. Based in §Jeddah, Saudi Arabia§, I build systems that don't just work in notebooks — they ship to production and create real impact.`;

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.05,
    },
  },
};

export default function BioReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  // Split on whitespace but keep markers around highlighted phrases.
  const tokens = useMemo(() => tokenize(BIO), []);

  return (
    <motion.p
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      data-cursor="text"
      className="text-balance text-[17px] leading-[1.65] text-[color:var(--text-secondary)] md:text-lg md:leading-[1.7]"
    >
      {tokens.map((tok, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className={`inline-block whitespace-pre ${
            tok.highlight
              ? "font-medium text-[color:var(--text-primary)]"
              : ""
          }`}
          style={
            tok.highlight
              ? {
                  borderBottom: "1px dashed rgba(0,212,255,0.35)",
                  paddingBottom: "1px",
                }
              : undefined
          }
        >
          {tok.text}
          {tok.trailingSpace && " "}
        </motion.span>
      ))}
    </motion.p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tokenizer                                                                 */
/* -------------------------------------------------------------------------- */

interface Token {
  text: string;
  highlight: boolean;
  trailingSpace: boolean;
}

/**
 * Splits the bio into words, marking phrases wrapped in `§…§` as highlighted.
 * Highlighted spans stay atomic — e.g. "Computer Vision" animates as one
 * unit — so multi-word key terms don't get visually cut.
 */
function tokenize(src: string): Token[] {
  const parts = src.split(/§([^§]+)§/g);
  const out: Token[] = [];

  parts.forEach((chunk, index) => {
    if (!chunk) return;
    const isHighlight = index % 2 === 1;
    if (isHighlight) {
      out.push({ text: chunk, highlight: true, trailingSpace: true });
    } else {
      chunk.split(/\s+/).forEach((word) => {
        if (!word) return;
        out.push({ text: word, highlight: false, trailingSpace: true });
      });
    }
  });

  // The final token shouldn't force a trailing space.
  if (out.length) out[out.length - 1].trailingSpace = false;
  return out;
}
