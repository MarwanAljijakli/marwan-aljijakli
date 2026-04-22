"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ==========================================================================
 * Terminal
 * --------------------------------------------------------------------------
 * A vertical monospace terminal that types four scripted commands with their
 * responses when it scrolls into view.
 *
 *   60 ms per character
 *   140 ms pause between sibling lines
 *   350 ms pause before each new prompt
 *   blinking block cursor at the current write head
 *
 * Line types:
 *   • prompt  — drawn as `$ <text>` with a cyan `$` prefix
 *   • output  — drawn indented below the prompt in muted text
 *   • blank   — empty spacer line (separates command sections)
 * ========================================================================== */

type LineKind = "prompt" | "output" | "blank";

interface Line {
  kind: LineKind;
  text: string;
  /** Optional per-line colour override (for emphasis). */
  accent?: "cyan" | "violet" | "orange";
}

const LINES: Line[] = [
  { kind: "prompt", text: "whoami" },
  { kind: "output", text: "marwan_aljijakli", accent: "cyan" },
  { kind: "blank", text: "" },

  { kind: "prompt", text: "cat mission.txt" },
  { kind: "output", text: "Transform data into intelligence." },
  { kind: "output", text: "Deploy intelligence at scale." },
  { kind: "output", text: "Repeat." },
  { kind: "blank", text: "" },

  { kind: "prompt", text: "echo $LOCATION" },
  { kind: "output", text: "Jeddah, Saudi Arabia 🇸🇦", accent: "cyan" },
  { kind: "blank", text: "" },

  { kind: "prompt", text: "cat current_role.txt" },
  { kind: "output", text: "CTO @ BOHIO  |  AI Engineer @ VLEED", accent: "orange" },
];

const CHAR_MS = 60;
const LINE_MS = 140;
const SECTION_MS = 350;
const BLANK_MS = 90;
const START_DELAY_MS = 250;

export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // `typed[i]` is whatever portion of LINES[i] has been written so far.
  // Lines beyond the current pointer haven't been started at all.
  const [typed, setTyped] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lineIdx = 0;
    let charIdx = 0;
    const acc: string[] = [];

    const step = () => {
      if (cancelled) return;

      if (lineIdx >= LINES.length) {
        setDone(true);
        return;
      }

      const line = LINES[lineIdx];

      // Blank lines are instantaneous "holds".
      if (line.kind === "blank") {
        acc.push("");
        lineIdx++;
        charIdx = 0;
        setTyped([...acc]);
        timer = setTimeout(step, BLANK_MS);
        return;
      }

      // Start of a new line — push an empty placeholder.
      if (charIdx === 0) acc.push("");

      charIdx++;
      acc[acc.length - 1] = line.text.slice(0, charIdx);
      setTyped([...acc]);

      if (charIdx >= line.text.length) {
        lineIdx++;
        charIdx = 0;
        const nextIsPrompt =
          lineIdx < LINES.length && LINES[lineIdx].kind === "prompt";
        timer = setTimeout(step, nextIsPrompt ? SECTION_MS : LINE_MS);
      } else {
        timer = setTimeout(step, CHAR_MS);
      }
    };

    timer = setTimeout(step, START_DELAY_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      data-cursor="text"
      className="overflow-hidden rounded-xl border border-[color:var(--accent-primary)]/20 bg-[color:var(--bg-primary)]"
      style={{
        boxShadow: "0 20px 60px -20px rgba(0,212,255,0.18)",
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-[color:var(--bg-secondary)] px-4 py-2">
        <span className="inline-block h-2 w-2 rounded-full bg-red-500/70" />
        <span className="inline-block h-2 w-2 rounded-full bg-yellow-500/70" />
        <span className="inline-block h-2 w-2 rounded-full bg-green-500/70" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
          ~/marwan — zsh
        </span>
        <span className="ml-auto font-mono text-[10px] text-[color:var(--text-muted)]">
          {done ? "○ idle" : "● running"}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-5 font-mono text-[13px] leading-[1.75] text-[color:var(--text-primary)]">
        {LINES.map((line, i) => {
          const content = typed[i];
          if (content === undefined) return null; // not yet reached

          const isLastActive = !done && i === typed.length - 1;

          if (line.kind === "blank") {
            return <div key={i} className="h-3" aria-hidden />;
          }

          if (line.kind === "prompt") {
            return (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-[color:var(--accent-primary)]">$</span>
                <span className="text-[color:var(--text-primary)]">
                  {content}
                  {isLastActive && <Caret />}
                </span>
              </div>
            );
          }

          // output
          const color = accentColor(line.accent);
          return (
            <div
              key={i}
              className="pl-3"
              style={color ? { color } : { color: "var(--text-secondary)" }}
            >
              {content}
              {isLastActive && <Caret />}
            </div>
          );
        })}

        {/* Persistent block caret after "done" */}
        {done && (
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[color:var(--accent-primary)]">$</span>
            <Caret />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-[color:var(--accent-primary)]"
      style={{
        animation: "blink 1s step-end infinite",
        boxShadow: "0 0 10px rgba(0,212,255,0.6)",
      }}
    />
  );
}

function accentColor(accent: Line["accent"]) {
  switch (accent) {
    case "cyan":
      return "var(--accent-primary)";
    case "violet":
      return "var(--accent-secondary)";
    case "orange":
      return "var(--accent-tertiary)";
    default:
      return null;
  }
}
