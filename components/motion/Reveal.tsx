"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT, VIEWPORT_ONCE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait once the block is in view. */
  delay?: number;
  /** Starting offset in px; the block rises from here. */
  y?: number;
}

/** Fade-and-rise entrance, played once when the block scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: DURATION.base, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
