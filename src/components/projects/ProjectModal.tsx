"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import TechPill from "./TechPill";
import type { AccentColor, Project } from "./data";

/**
 * Right-side drawer that shows the full details of a project. Opened by
 * clicking a card's "View Project" CTA. Handles:
 *   - ESC-to-close
 *   - Click-outside (backdrop) to close
 *   - Body scroll lock while open
 *   - Auto-focus + focus trap on the close button
 *   - Respecting prefers-reduced-motion via Framer's default behaviour
 */
export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /* ESC key + body scroll lock + floating-nav signal ---------------------
   * The global nav satellites (scroll progress bar, right-edge section
   * dots, bottom-right back-to-top FAB) subscribe to
   * `html[data-modal="open"]` in globals.css and fade themselves out while
   * the drawer is up — otherwise they poke through over the modal at the
   * same z-range and the whole thing reads as broken. */
  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-modal", "open");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Autofocus the close button for keyboard users.
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute("data-modal");
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close project details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[180] bg-[color:var(--bg-primary)]/85 backdrop-blur-md"
            style={{ cursor: "none" }}
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-modal-title-${project.slug}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[181] h-dvh w-full max-w-[640px] overflow-y-auto border-l border-[color:var(--accent-primary)]/20 bg-[color:var(--bg-primary)]"
            style={{
              boxShadow: "-40px 0 100px -20px rgba(0,0,0,0.8)",
            }}
          >
            <Accent accent={project.accent} />

            <div className="relative flex flex-col gap-10 px-8 py-10 md:px-12 md:py-14">
              {/* Top bar */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col gap-3">
                  {project.badge && (
                    <BadgeChip badge={project.badge} />
                  )}
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[color:var(--accent-primary)]">
                    {project.role && <span>{project.role}</span>}
                    {project.role && project.year && (
                      <span className="mx-2 text-[color:var(--text-muted)]">·</span>
                    )}
                    {project.year && <span>{project.year}</span>}
                  </div>
                </div>

                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  aria-label="Close"
                  data-cursor="hover"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] transition-colors hover:border-[color:var(--accent-primary)] hover:text-[color:var(--accent-primary)]"
                >
                  <X className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>

              {/* Title */}
              <div>
                <h3
                  id={`project-modal-title-${project.slug}`}
                  className="font-display leading-[0.9]"
                  style={{
                    fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {project.title}
                </h3>
                <p className="mt-3 max-w-xl text-[color:var(--text-secondary)] md:text-lg">
                  {project.subtitle}
                </p>
              </div>

              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {project.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-white/5 bg-[color:var(--bg-secondary)]/60 p-4"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                        {m.label}
                      </div>
                      <div className="mt-1.5 font-display text-xl text-[color:var(--accent-primary)]">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Long description */}
              <div className="flex flex-col gap-5">
                <SectionEyebrow>Overview</SectionEyebrow>
                {project.longDescription.map((p, i) => (
                  <p
                    key={i}
                    data-cursor="text"
                    className="text-[color:var(--text-secondary)] md:text-[17px] md:leading-[1.7]"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="flex flex-col gap-4">
                  <SectionEyebrow>Highlights</SectionEyebrow>
                  <ul className="flex flex-col gap-2">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[color:var(--accent-primary)]/40 text-[color:var(--accent-primary)]">
                          <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                        </span>
                        <span className="text-[15px] text-[color:var(--text-primary)]">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech stack */}
              <div className="flex flex-col gap-4">
                <SectionEyebrow>Stack</SectionEyebrow>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <TechPill key={t} accent={pillAccent(project.accent)}>
                      {t}
                    </TechPill>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className="rounded-2xl border border-[color:var(--accent-primary)]/20 bg-[color:var(--bg-secondary)]/40 p-6">
                <SectionEyebrow>Impact</SectionEyebrow>
                <p className="mt-3 text-[color:var(--text-primary)] md:text-lg md:leading-[1.55]">
                  {project.impact}
                </p>
              </div>

              {/* CTAs */}
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      data-cursor="hover"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        link.href.startsWith("http") ? "noreferrer noopener" : undefined
                      }
                      className={
                        link.primary
                          ? "group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-primary)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--bg-primary)] transition-transform duration-300 hover:scale-[1.03]"
                          : "group inline-flex items-center gap-2 rounded-full border border-white/15 bg-transparent px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-primary)] transition-colors hover:border-[color:var(--accent-primary)] hover:text-[color:var(--accent-primary)]"
                      }
                    >
                      {link.label}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Subcomponents                                                             */
/* -------------------------------------------------------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-primary)]">
      {children}
    </div>
  );
}

function BadgeChip({ badge }: { badge: Project["badge"] & object }) {
  const toneClasses = {
    amber: "text-amber-300 border-amber-400/40 bg-amber-400/10",
    orange: "text-[color:var(--accent-tertiary)] border-[color:var(--accent-tertiary)]/40 bg-[color:var(--accent-tertiary)]/10",
    cyan: "text-[color:var(--accent-primary)] border-[color:var(--accent-primary)]/40 bg-[color:var(--accent-primary)]/10",
    violet:
      "text-[#c6a4f5] border-[color:var(--accent-secondary)]/40 bg-[color:var(--accent-secondary)]/10",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${toneClasses[badge.tone]}`}
    >
      <span aria-hidden>{badge.emoji}</span>
      {badge.label}
    </span>
  );
}

function Accent({ accent }: { accent: AccentColor }) {
  const map = {
    cyan: "rgba(0, 212, 255, 0.25)",
    violet: "rgba(123, 47, 190, 0.3)",
    orange: "rgba(255, 107, 53, 0.28)",
    amber: "rgba(252, 196, 78, 0.28)",
  } as const;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background: `radial-gradient(600px 260px at 90% 0%, ${map[accent]} 0%, transparent 65%)`,
      }}
    />
  );
}

function pillAccent(accent: AccentColor): "cyan" | "violet" | "orange" {
  if (accent === "violet") return "violet";
  if (accent === "orange" || accent === "amber") return "orange";
  return "cyan";
}
