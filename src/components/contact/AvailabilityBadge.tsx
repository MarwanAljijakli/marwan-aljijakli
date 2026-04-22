"use client";

import { motion } from "framer-motion";

/** Top-right availability indicator. Breathing green dot + compact label. */
export default function AvailabilityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 rounded-full border border-[#10dc78]/30 bg-[color:var(--bg-secondary)]/50 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-secondary)] backdrop-blur-sm"
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: "#10dc78",
            boxShadow: "0 0 12px #10dc78",
          }}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border border-[#10dc78]"
          animate={{ scale: [1, 2, 2.3], opacity: [0.6, 0.2, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </span>
      <span>
        <span className="text-[#5ef5a6]">Available</span>
        <span className="ml-2 text-[color:var(--text-muted)]">
          for new opportunities
        </span>
      </span>
    </motion.div>
  );
}
