"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";

/* ==========================================================================
 * SkillBars
 * --------------------------------------------------------------------------
 * 6 horizontal skill bars that fill left-to-right once the group scrolls
 * into view. The percentage number counts up alongside the fill.
 * ========================================================================== */

interface Skill {
  label: string;
  value: number;
}

const SKILLS: Skill[] = [
  { label: "PyTorch / TensorFlow", value: 92 },
  { label: "LangChain & RAG Pipelines", value: 95 },
  { label: "Computer Vision (YOLO, OpenCV)", value: 90 },
  { label: "Docker / FastAPI / DevOps", value: 88 },
  { label: "Prompt Engineering", value: 97 },
  { label: "Flutter & Mobile Integration", value: 75 },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const BAR_DURATION = 1500;

export default function SkillBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div ref={ref} className="flex flex-col gap-5" aria-label="Skills">
      {SKILLS.map((skill, i) => (
        <SkillRow
          key={skill.label}
          skill={skill}
          inView={inView}
          delaySec={i * 0.09}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SkillRow({
  skill,
  inView,
  delaySec,
}: {
  skill: Skill;
  inView: boolean;
  delaySec: number;
}) {
  // Gate the number count-up so it lines up with the bar's animation delay.
  const [countStart, setCountStart] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(
      () => setCountStart(true),
      Math.round(delaySec * 1000)
    );
    return () => window.clearTimeout(id);
  }, [inView, delaySec]);

  const count = useCountUp(skill.value, {
    trigger: countStart,
    duration: BAR_DURATION,
  });

  return (
    <div className="group">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-primary)]">
          {skill.label}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delaySec + 0.15, duration: 0.4 }}
          className="font-mono text-[11px] tabular-nums text-[color:var(--accent-primary)]"
        >
          {Math.round(count)}%
        </motion.span>
      </div>

      <div className="relative h-[6px] overflow-hidden rounded-full bg-[color:var(--bg-secondary)]">
        <span
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,212,255,0.05), rgba(123,47,190,0.05))",
          }}
        />

        <motion.span
          aria-hidden
          className="relative block h-full origin-left rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
            boxShadow: "0 0 12px rgba(0,212,255,0.45)",
          }}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${skill.value}%` } : {}}
          transition={{
            duration: BAR_DURATION / 1000,
            delay: delaySec,
            ease: EASE_OUT_EXPO,
          }}
        >
          {/* leading-edge shimmer */}
          <motion.span
            className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/80"
            style={{ boxShadow: "0 0 16px #ffffff" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: [0, 1, 0.6], scale: [0.5, 1, 0.9] } : {}}
            transition={{
              duration: BAR_DURATION / 1000,
              delay: delaySec,
              ease: EASE_OUT_EXPO,
            }}
          />
        </motion.span>
      </div>
    </div>
  );
}
