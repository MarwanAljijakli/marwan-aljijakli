"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { memo, useEffect, useState, type MouseEvent } from "react";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { scrollToId, scrollToTop } from "@/lib/scroll";
import { SECTIONS, SECTION_IDS } from "./sections";

/* ==========================================================================
 * Nav
 * --------------------------------------------------------------------------
 * Fixed top navigation. On desktop: logo left, links centered, Hire Me CTA
 * right. On mobile: logo left, animated hamburger right; the hamburger
 * opens a full-screen stagger-revealed overlay.
 *
 * On scroll (after ~16px), the bar transitions from transparent to a dark
 * glass panel with a thin bottom border.
 * ========================================================================== */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function NavImpl() {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Drive the "glass" look from scroll position.
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 120], [0, 0.85]);
  const blur = useTransform(scrollY, [0, 120], [0, 20]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 16));
    return () => unsub();
  }, [scrollY]);

  // Close the mobile overlay whenever the route hash changes or ESC is hit.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while the overlay is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleLinkClick =
    (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setOpen(false);
      // Small delay so the overlay can start closing before scrolling
      window.setTimeout(() => scrollToId(id), open ? 180 : 0);
    };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    scrollToTop();
  };

  return (
    <>
      <motion.header
        role="banner"
        className="fixed inset-x-0 top-0 z-[50]"
      >
        {/* Animated glass backdrop */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: useTransform(
              bgOpacity,
              (o) => `rgba(5, 10, 15, ${o})`
            ),
            backdropFilter: useTransform(blur, (b) => `blur(${b}px)`),
            WebkitBackdropFilter: useTransform(blur, (b) => `blur(${b}px)`),
          }}
        />
        {/* Bottom hairline — appears once scrolled */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,212,255,0.55), transparent)",
            opacity: scrolled ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />

        <div className="container-page relative flex h-16 items-center justify-between gap-4 md:h-[72px]">
          {/* --- Left: Logo ----------------------------------------------- */}
          <a
            href="#top"
            onClick={handleLogoClick}
            aria-label="Marwan Aljijakli — home"
            data-cursor="hover"
            className="group inline-flex items-baseline gap-1"
          >
            <span
              className="font-display text-2xl tracking-wide text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--accent-primary)] md:text-[28px]"
              style={{ letterSpacing: "0.02em" }}
            >
              MA
            </span>
            <motion.span
              aria-hidden
              className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-[color:var(--accent-primary)]"
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ boxShadow: "0 0 10px rgba(0,212,255,0.8)" }}
            />
          </a>

          {/* --- Center: desktop links ------------------------------------ */}
          <ul className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={handleLinkClick(s.id)}
                    data-cursor="hover"
                    aria-current={isActive ? "true" : undefined}
                    className="group relative block px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em]"
                  >
                    <span
                      className={`relative z-10 transition-colors ${
                        isActive
                          ? "text-[color:var(--accent-primary)]"
                          : "text-[color:var(--text-secondary)] group-hover:text-[color:var(--text-primary)]"
                      }`}
                      style={
                        isActive
                          ? { textShadow: "0 0 10px rgba(0,212,255,0.45)" }
                          : undefined
                      }
                    >
                      {s.label}
                    </span>
                    {/* Underline — draws in on hover / pinned while active */}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 bottom-1 h-px origin-left transform-gpu rounded-full bg-[color:var(--accent-primary)] transition-transform duration-300 ease-out ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                      style={{
                        boxShadow: isActive
                          ? "0 0 8px rgba(0,212,255,0.7)"
                          : undefined,
                      }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* --- Right: Hire Me (desktop) / Hamburger (mobile) ------------ */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={handleLinkClick("contact")}
              data-cursor="hover"
              className="group relative hidden items-center gap-2 overflow-hidden rounded-full bg-[color:var(--accent-primary)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--bg-primary)] transition-transform duration-200 hover:scale-[1.04] md:inline-flex"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[color:var(--accent-primary)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-80"
              />
              <Mail className="h-3.5 w-3.5" strokeWidth={2} />
              Hire Me
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>

            <Hamburger open={open} onToggle={() => setOpen((v) => !v)} />
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <MobileOverlay
            active={active}
            onNavigate={(id) => {
              setOpen(false);
              window.setTimeout(() => scrollToId(id), 180);
            }}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Prop-free top-level nav — memoise so re-renders triggered by parent
 *  layout state changes (loader `ready`) don't needlessly rebuild the tree. */
const Nav = memo(NavImpl);
export default Nav;

/* -------------------------------------------------------------------------- */
/*  Hamburger button                                                          */
/* -------------------------------------------------------------------------- */

function Hamburger({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      data-cursor="hover"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[color:var(--bg-secondary)]/40 backdrop-blur-sm md:hidden"
    >
      <span className="relative block h-4 w-5">
        <motion.span
          className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-[color:var(--text-primary)]"
          animate={
            open
              ? { top: "50%", rotate: 45, y: "-50%" }
              : { top: "0%", rotate: 0, y: "0%" }
          }
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-[color:var(--text-primary)]"
          animate={open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[color:var(--text-primary)]"
          animate={
            open
              ? { bottom: "50%", rotate: -45, y: "50%" }
              : { bottom: "0%", rotate: 0, y: "0%" }
          }
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile overlay                                                            */
/* -------------------------------------------------------------------------- */

function MobileOverlay({
  active,
  onNavigate,
  onClose,
}: {
  active: string | null;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      key="mobile-overlay"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[48] md:hidden"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--bg-primary)]/95 backdrop-blur-xl"
      />

      {/* Decorative accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 grid-bg mask-radial-fade"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.35), transparent 70%)",
        }}
      />

      {/* Content — right-aligned panel */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        className="relative ml-auto flex h-full w-full max-w-sm flex-col justify-between border-l border-white/5 px-8 pb-10 pt-24"
      >
        {/* Links */}
        <motion.ul
          className="flex flex-col gap-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
          }}
        >
          {SECTIONS.map((s, i) => {
            const isActive = active === s.id;
            return (
              <motion.li
                key={s.id}
                variants={{
                  hidden: { opacity: 0, x: 40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              >
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(s.id);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative block py-3 font-display leading-none tracking-tight ${
                    isActive
                      ? "text-[color:var(--accent-primary)]"
                      : "text-[color:var(--text-primary)]"
                  }`}
                  style={{ fontSize: "clamp(2.25rem, 10vw, 3rem)" }}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.label.toUpperCase()}
                    {isActive && (
                      <motion.span
                        layoutId="mobile-active-dot"
                        className="ml-2 inline-block h-2 w-2 rounded-full bg-[color:var(--accent-primary)]"
                        style={{
                          boxShadow: "0 0 12px rgba(0,212,255,0.9)",
                        }}
                      />
                    )}
                  </span>
                </a>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Footer block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE_OUT_EXPO }}
          className="flex flex-col gap-4 border-t border-white/5 pt-6"
        >
          <a
            href="mailto:marwan2004000@gmail.com"
            className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-primary)]/40 bg-[color:var(--accent-primary)]/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--accent-primary)] transition-colors hover:bg-[color:var(--accent-primary)] hover:text-[color:var(--bg-primary)]"
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={2} />
            marwan2004000@gmail.com
          </a>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
            Jeddah, KSA · GMT+3
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
