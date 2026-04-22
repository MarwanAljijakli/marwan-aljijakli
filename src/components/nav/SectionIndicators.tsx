"use client";

import { motion } from "framer-motion";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { scrollToId } from "@/lib/scroll";
import { SECTIONS, SECTION_IDS } from "./sections";

/**
 * Fixed column of dot indicators pinned mid-right of the viewport on
 * desktop. Each dot represents a section; the dot for the section
 * currently under the viewport midline glows in cyan. Hovering a dot
 * reveals a compact label to its left.
 *
 * Hidden on touch / narrow viewports — mobile users get the hamburger nav.
 */
export default function SectionIndicators() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <nav
      aria-label="Page sections"
      data-floating-nav
      className="pointer-events-auto fixed right-5 top-1/2 z-[45] hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col items-end gap-4">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToId(section.id)}
                aria-label={`Scroll to ${section.label}`}
                aria-current={isActive ? "true" : undefined}
                data-cursor="hover"
                data-cursor-label={section.label}
                className="group relative flex items-center gap-3"
              >
                {/* Floating label (reveals on hover) */}
                <span
                  className="translate-x-1 rounded-full border border-white/10 bg-[color:var(--bg-secondary)]/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-primary)] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  style={{
                    boxShadow: "0 6px 24px -6px rgba(0,212,255,0.3)",
                  }}
                >
                  {section.label}
                </span>

                {/* Dot */}
                <motion.span
                  aria-hidden
                  animate={{
                    scale: isActive ? 1.3 : 1,
                    backgroundColor: isActive ? "#00D4FF" : "#3a4e68",
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="relative block h-2 w-2 rounded-full"
                  style={{
                    boxShadow: isActive
                      ? "0 0 14px rgba(0,212,255,0.75), 0 0 0 3px rgba(0,212,255,0.15)"
                      : "none",
                  }}
                >
                  {/* Active ping ring */}
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-[color:var(--accent-primary)]"
                      animate={{ scale: [1, 2, 2.6], opacity: [0.6, 0.1, 0] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
