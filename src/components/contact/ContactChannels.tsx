"use client";

import { motion, useInView } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useRef } from "react";
import ChannelCard, { type Channel } from "./ChannelCard";
import DockerIcon from "./icons/DockerIcon";
import GithubIcon from "./icons/GithubIcon";
import LinkedinIcon from "./icons/LinkedinIcon";

/* ==========================================================================
 * ContactChannels
 * --------------------------------------------------------------------------
 * Five channel cards laid out as a responsive row. A thin dashed "signal
 * line" runs through each gap with a packet of light that travels along it
 * on loop — the transmission is always in flight.
 * ========================================================================== */

const CHANNELS: Channel[] = [
  {
    id: "email",
    label: "Email",
    displayValue: "marwan2004000@gmail.com",
    cta: "Write an email",
    href: "mailto:marwan2004000@gmail.com",
    Icon: Mail,
    accent: "#00D4FF",
  },
  {
    id: "phone",
    label: "Phone",
    displayValue: "+966 57 222 1939",
    cta: "Call directly",
    href: "tel:+966572221939",
    Icon: Phone,
    accent: "#10dc78",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    displayValue: "marwan-aljijakli",
    cta: "View profile",
    href: "https://www.linkedin.com/in/marwan-aljijakli-7ba965241/",
    Icon: LinkedinIcon,
    accent: "#38BDF8",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    displayValue: "MarwanAljijakli",
    cta: "View profile",
    href: "https://github.com/MarwanAljijakli",
    Icon: GithubIcon,
    accent: "#e8f4fd",
    external: true,
  },
  {
    id: "docker",
    label: "Docker Hub",
    displayValue: "marwanaljijakli",
    cta: "View profile",
    href: "https://hub.docker.com/u/marwanaljijakli",
    Icon: DockerIcon,
    accent: "#2496ed",
    external: true,
  },
];

export default function ContactChannels() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div ref={ref} className="relative">
      {/* Signal rail running behind the cards — responsive (vertical on mobile) */}
      <SignalRail inView={inView} />

      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CHANNELS.map((ch, i) => (
          <ChannelCard key={ch.id} channel={ch} index={i} inView={inView} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** A decorative SVG line that traces through each card's center, only
 *  visible on lg+ where the cards are in one horizontal row. */
function SignalRail({ inView }: { inView: boolean }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-[2px] w-full -translate-y-[14px] lg:block"
      viewBox="0 0 1000 4"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="channel-rail" x1="0" x2="1">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.0" />
          <stop offset="10%" stopColor="#00D4FF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#7B2FBE" stopOpacity="0.6" />
          <stop offset="90%" stopColor="#FF6B35" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.line
        x1="0"
        y1="2"
        x2="1000"
        y2="2"
        stroke="url(#channel-rail)"
        strokeWidth="1"
        strokeDasharray="6 6"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Four travelling packets — staggered phase so one is always in view */}
      {[0, 0.25, 0.5, 0.75].map((offset, i) => (
        <motion.circle
          key={i}
          r="2"
          cy="2"
          fill="#ffffff"
          initial={{ cx: 0, opacity: 0 }}
          animate={
            inView
              ? {
                  cx: [0, 1000],
                  opacity: [0, 1, 1, 0],
                }
              : {}
          }
          transition={{
            duration: 4.4,
            delay: offset * 4.4,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.05, 0.95, 1],
          }}
          style={{
            filter: "drop-shadow(0 0 4px rgba(191,247,255,0.9))",
          }}
        />
      ))}
    </svg>
  );
}

