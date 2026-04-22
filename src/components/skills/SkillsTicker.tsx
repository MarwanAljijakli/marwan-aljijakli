"use client";

/* ==========================================================================
 * SkillsTicker
 * --------------------------------------------------------------------------
 * Infinite horizontal marquee. Two copies of the content are laid out side
 * by side, and the whole track is translated by -50% over one animation
 * cycle — the handoff from copy A to copy B is seamless because, at the
 * moment the first half fully clears the viewport, the second half is in
 * exactly the same position copy A started from.
 * ========================================================================== */

const STATS = [
  { label: "Models Trained", value: "100+" },
  { label: "RAG Pipelines Built", value: "10+" },
  { label: "Docker Containers Deployed", value: "50+" },
  { label: "YOLO Models Fine-tuned", value: "15+" },
  { label: "LLM APIs Integrated", value: "8+" },
  { label: "Industries Served", value: "5+" },
] as const;

export default function SkillsTicker() {
  return (
    <div
      aria-label="Live engineering statistics"
      className="relative overflow-hidden border-y border-[color:var(--accent-primary)]/15 bg-[color:var(--bg-secondary)]/60 backdrop-blur-sm"
    >
      {/* edge fades so content flows off-screen smoothly */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
        style={{
          background:
            "linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
        style={{
          background:
            "linear-gradient(270deg, var(--bg-primary) 0%, transparent 100%)",
        }}
      />

      <div className="flex items-center py-4">
        <div className="flex shrink-0 animate-marquee gap-10 whitespace-nowrap pr-10">
          <TickerContent />
          <TickerContent />
        </div>
      </div>
    </div>
  );
}

function TickerContent() {
  return (
    <>
      {STATS.map((s) => (
        <span
          key={s.label}
          className="flex shrink-0 items-center gap-3 font-mono text-[12px] uppercase tracking-[0.26em]"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent-primary)] shadow-[0_0_8px_rgba(0,212,255,0.7)]" />
          <span className="text-[color:var(--text-muted)]">{s.label}:</span>
          <span className="font-semibold text-[color:var(--accent-primary)]">
            {s.value}
          </span>
          <span className="mx-2 text-[color:var(--text-muted)]/40">|</span>
        </span>
      ))}
    </>
  );
}
