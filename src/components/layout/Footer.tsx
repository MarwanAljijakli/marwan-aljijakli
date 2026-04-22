"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { memo } from "react";
import DockerIcon from "@/components/contact/icons/DockerIcon";
import GithubIcon from "@/components/contact/icons/GithubIcon";
import LinkedinIcon from "@/components/contact/icons/LinkedinIcon";

/* ==========================================================================
 * Footer
 * --------------------------------------------------------------------------
 * Four-column footer (name/role · nav · socials · bottom bar) stacked on
 * mobile, 3-row grid on desktop. A slow, barely perceptible mesh-gradient
 * sits behind everything.
 * ========================================================================== */

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

const SOCIALS = [
  {
    href: "mailto:marwan2004000@gmail.com",
    label: "Email",
    Icon: Mail,
  },
  {
    href: "https://www.linkedin.com/in/marwan-aljijakli-7ba965241/",
    label: "LinkedIn",
    Icon: LinkedinIcon,
    external: true,
  },
  {
    href: "https://github.com/MarwanAljijakli",
    label: "GitHub",
    Icon: GithubIcon,
    external: true,
  },
  {
    href: "https://hub.docker.com/u/marwanaljijakli",
    label: "Docker Hub",
    Icon: DockerIcon,
    external: true,
  },
];

function FooterImpl() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="relative isolate overflow-hidden border-t border-white/5 bg-[color:var(--bg-primary)]"
    >
      {/* Subtle animated mesh */}
      <FooterMesh />

      {/* Faint grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 grid-bg mask-bottom-fade"
      />

      {/* Top hairline in the brand gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.45) 30%, rgba(123,47,190,0.45) 60%, rgba(255,107,53,0.35) 85%, transparent 100%)",
          boxShadow: "0 0 20px rgba(0,212,255,0.25)",
        }}
      />

      <div className="container-page relative flex flex-col gap-14 py-16 md:py-20">
        {/* Top row */}
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr] md:gap-8">
          {/* Brand block */}
          <div className="flex flex-col gap-3">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display leading-[0.85] tracking-tight text-[color:var(--text-primary)]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              MARWAN <span className="text-gradient">ALJIJAKLI</span>
            </motion.h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.26em] text-[color:var(--text-muted)]">
              <span>CTO</span>
              <Dot />
              <span>AI / ML Engineer</span>
              <Dot />
              <span>Computer Vision</span>
              <Dot />
              <span>Generative AI</span>
            </div>

            {/* Location + status */}
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[color:var(--text-muted)]">
              <span className="inline-block h-1.5 w-1.5 animate-pulse-slow rounded-full bg-[color:var(--accent-primary)]" />
              Jeddah, KSA · GMT+3
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className="flex flex-col gap-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--accent-primary)]">
              /· navigate
            </div>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    data-cursor="hover"
                    className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--accent-primary)]"
                  >
                    <span
                      aria-hidden
                      className="inline-block h-px w-3 bg-[color:var(--text-muted)] transition-all duration-300 group-hover:w-6 group-hover:bg-[color:var(--accent-primary)]"
                    />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--accent-primary)]">
              /· channels
            </div>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  data-cursor="hover"
                  data-cursor-label={s.label}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noreferrer noopener" : undefined}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[color:var(--bg-secondary)]/60 text-[color:var(--text-secondary)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent-primary)] hover:text-[color:var(--accent-primary)] hover:shadow-[0_0_16px_rgba(0,212,255,0.35)]"
                >
                  <s.Icon className="h-4 w-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>

            <p className="mt-2 font-mono text-[10px] leading-relaxed text-[color:var(--text-muted)]">
              Open to high-leverage AI engineering roles, CTO engagements, and
              short-cycle research collaborations.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[11px] text-[color:var(--text-muted)]">
            © {year}{" "}
            <span className="text-[color:var(--text-secondary)]">
              Marwan Aljijakli
            </span>
            . Built with AI, deployed with purpose.{" "}
            <span className="text-[color:var(--text-secondary)]">
              Jeddah, Saudi Arabia 🇸🇦
            </span>
          </p>

          <p className="font-mono text-[10px] text-[color:var(--text-muted)]/70">
            <span className="mr-1 select-none opacity-80">{`//`}</span> Made
            with{" "}
            <span className="text-[color:var(--accent-primary)]/80">
              Claude Code
            </span>{" "}
            🤖
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */

function Dot() {
  return (
    <span
      aria-hidden
      className="inline-block h-1 w-1 rounded-full bg-[color:var(--text-muted)]/60"
    />
  );
}

function FooterMesh() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -inset-[30%]"
        animate={{
          transform: [
            "translate3d(-8%, -6%, 0)",
            "translate3d(6%, 4%, 0)",
            "translate3d(-8%, -6%, 0)",
          ],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(50% 50% at 20% 30%, rgba(0,212,255,0.18), transparent 60%)",
        }}
      />
      <motion.div
        className="absolute -inset-[30%]"
        animate={{
          transform: [
            "translate3d(6%, 6%, 0)",
            "translate3d(-4%, -8%, 0)",
            "translate3d(6%, 6%, 0)",
          ],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(45% 45% at 80% 70%, rgba(123,47,190,0.18), transparent 60%)",
        }}
      />
    </div>
  );
}

/** Memoised because the footer is prop-free and never needs to re-render
 *  after mount — keeps us out of any parent re-render loops. */
const Footer = memo(FooterImpl);
export default Footer;

