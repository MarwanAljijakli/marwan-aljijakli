"use client";

import { motion } from "framer-motion";
import StatisticalWaveBackground from "@/components/backgrounds/StatisticalWaveBackground";
import GlitchText from "@/components/common/GlitchText";
import AvailabilityBadge from "./AvailabilityBadge";
import ContactChannels from "./ContactChannels";
import ContactForm from "./ContactForm";
import RadarSweep from "./RadarSweep";

/* ==========================================================================
 * Contact — "Initiate Contact"
 * --------------------------------------------------------------------------
 * Full-section layout:
 *   1. Radar sweep backdrop (absolute, full-bleed)
 *   2. Availability badge pinned top-right
 *   3. Headline: "INITIATE CONTACT" eyebrow + "LET'S BUILD / SOMETHING"
 *   4. Five transmission channel cards with an animated signal rail
 *   5. Glass-morphism form with floating-label fields + particle-burst CTA
 * ========================================================================== */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact Marwan Aljijakli"
      className="relative isolate overflow-hidden border-t border-white/5 py-28 md:py-36"
    >
      {/* Layer 1: radar sweep */}
      <RadarSweep />

      {/* Layer 1b: statistical wave band across the bottom */}
      <StatisticalWaveBackground opacity={0.9} height={260} />

      {/* Layer 2: readability overlay — keeps long text crisp over the radar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at center, rgba(5,10,15,0.5) 0%, rgba(5,10,15,0.85) 70%, rgba(5,10,15,1) 100%)",
        }}
      />

      <div className="container-page relative">
        {/* Availability (top-right corner of content area) */}
        <div className="mb-10 flex items-start justify-between gap-4 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent-tertiary)]"
          >
            <span className="inline-block h-px w-10 bg-[color:var(--accent-tertiary)]" />
            06 · Initiate Contact
          </motion.div>

          <AvailabilityBadge />
        </div>

        {/* Headline */}
        <div className="flex flex-col">
          <motion.h2
            initial={{ opacity: 0, x: -60, skewX: -4 }}
            whileInView={{ opacity: 1, x: 0, skewX: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.95, ease: EASE_OUT_EXPO }}
            className="font-display leading-[0.85] text-[color:var(--text-primary)]"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              letterSpacing: "-0.02em",
              textShadow: "0 0 40px rgba(0,212,255,0.12)",
            }}
          >
            <GlitchText>LET&apos;S BUILD</GlitchText>
          </motion.h2>

          <motion.h2
            initial={{ opacity: 0, x: 60, skewX: 4 }}
            whileInView={{ opacity: 1, x: 0, skewX: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="-mt-2 font-display leading-[0.85] md:-mt-3"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              letterSpacing: "-0.02em",
              color: "transparent",
              WebkitTextStroke: "1.5px var(--accent-primary)",
              textShadow: "0 0 40px rgba(0,212,255,0.22)",
            }}
          >
            <GlitchText delayMs={220}>SOMETHING</GlitchText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="mt-6 max-w-xl text-[color:var(--text-secondary)] md:text-lg"
            data-cursor="text"
          >
            Pick any channel below, or send a direct transmission with the form.
            Replies usually land inside 24h.
          </motion.p>
        </div>

        {/* Transmission channels */}
        <div className="mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]"
          >
            <span className="inline-block h-px w-10 bg-[color:var(--text-muted)]" />
            Ways to reach me · 5 channels
          </motion.div>

          <ContactChannels />
        </div>

        {/* Form */}
        <div className="mt-20">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
