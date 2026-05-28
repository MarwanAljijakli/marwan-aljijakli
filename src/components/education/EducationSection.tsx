"use client";

import { motion, useInView } from "framer-motion";
import { Award, BookOpen, GraduationCap } from "lucide-react";
import { useRef } from "react";

/* ==========================================================================
 * EducationSection
 * --------------------------------------------------------------------------
 * Standalone Education & Certifications section with a prominent degree
 * card and a certification grid.
 * ========================================================================== */

interface Cert {
  name: string;
  issuer: string;
  year: string;
  icon: "award" | "book";
}

const DEGREE = {
  title: "B.Sc. Artificial Intelligence",
  institution: "Jeddah International College",
  gpa: "4.35 / 5.0",
  period: "2022 – 2026",
  detail: "Core AI foundations · ML · Computer Vision · NLP · Data Science",
};

const CERTS: Cert[] = [
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2024", icon: "award" },
  { name: "Google IT Automation with Python", issuer: "Google / Coursera", year: "2024", icon: "award" },
  { name: "IoT Specialization", issuer: "Coursera", year: "2024", icon: "book" },
  { name: "FreeRTOS Developer", issuer: "Embedded Systems Certification", year: "2024", icon: "award" },
  { name: "AI Training Program", issuer: "SDAIA — Saudi Data & AI Authority", year: "2024", icon: "book" },
  { name: "AI Training Program", issuer: "KAUST — King Abdullah University", year: "2024", icon: "book" },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      id="education"
      ref={sectionRef}
      aria-label="Education and certifications"
      className="relative isolate overflow-hidden py-24 md:py-32"
    >
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 grid-bg"
        style={{ backgroundSize: "48px 48px" }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,212,255,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="container-page relative">
        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--accent-primary)]"
        >
          <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.6} />
          Education &amp; Certifications
          <span className="ml-2 h-px flex-1 max-w-[120px] bg-gradient-to-r from-[color:var(--accent-primary)]/50 to-transparent" />
        </motion.div>

        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="font-display leading-[0.9] tracking-tight text-[color:var(--text-primary)]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Academic{" "}
          <span
            className="font-display"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.5px var(--accent-primary)",
            }}
          >
            Foundation
          </span>
        </motion.h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Degree card — prominent */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="group relative overflow-hidden rounded-2xl border border-[color:var(--accent-primary)]/20 bg-[color:var(--bg-secondary)] p-8 lg:p-10"
            style={{
              boxShadow:
                "0 0 0 1px rgba(0,212,255,0.06), 0 4px 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Hover glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(400px circle at 30% 20%, rgba(0,212,255,0.08), transparent 70%)",
              }}
            />

            {/* Top accent strip */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
              }}
            />

            <div className="relative">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent-primary)]/10">
                  <GraduationCap
                    className="h-6 w-6 text-[color:var(--accent-primary)]"
                    strokeWidth={1.5}
                  />
                </div>
                {/* GPA badge */}
                <div
                  className="flex items-center gap-2 rounded-full border border-[color:var(--accent-primary)]/30 px-4 py-1.5"
                  style={{ background: "rgba(0,212,255,0.06)" }}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                    GPA
                  </span>
                  <span
                    className="font-display text-xl text-[color:var(--accent-primary)]"
                    style={{ textShadow: "0 0 16px rgba(0,212,255,0.4)" }}
                  >
                    {DEGREE.gpa}
                  </span>
                </div>
              </div>

              <h3 className="font-display text-3xl leading-tight tracking-tight text-[color:var(--text-primary)] md:text-4xl">
                {DEGREE.title}
              </h3>

              <div className="mt-2 text-lg font-medium text-[color:var(--text-secondary)]">
                {DEGREE.institution}
              </div>

              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--accent-primary)]">
                {DEGREE.period}
              </div>

              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                {DEGREE.detail}
              </p>
            </div>
          </motion.div>

          {/* Certifications grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CERTS.map((cert, i) => (
              <CertCard key={`${cert.name}-${cert.issuer}`} cert={cert} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CertCard({
  cert,
  index,
  inView,
}: {
  cert: Cert;
  index: number;
  inView: boolean;
}) {
  const Icon = cert.icon === "award" ? Award : BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.3 + index * 0.07,
        ease: EASE_OUT_EXPO,
      }}
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-[color:var(--bg-secondary)] p-5 transition-colors hover:border-[color:var(--accent-primary)]/20 hover:bg-[color:var(--bg-tertiary)]"
    >
      {/* Hover highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(200px circle at 20% 20%, rgba(0,212,255,0.06), transparent 70%)",
        }}
      />

      <div className="relative flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-primary)]/10">
          <Icon
            className="h-4 w-4 text-[color:var(--accent-primary)]"
            strokeWidth={1.5}
          />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight text-[color:var(--text-primary)]">
            {cert.name}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
            {cert.issuer}
          </div>
          <div className="mt-1.5 font-mono text-[10px] text-[color:var(--accent-primary)]/70">
            {cert.year}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
