"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT, VIEWPORT_ONCE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

const FULL = "100% 42%";
const EMPTY = "0% 42%";

/**
 * Highlighter mark that "draws" under a phrase when it scrolls into view, echoing the
 * highlighted key phrases in Mellanda's portfolio PDF. Animates background-size only
 * (paint, no layout) and is static with reduced motion.
 */
export function Highlight({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.span
      className="rounded-[2px] text-ink [box-decoration-break:clone]"
      style={{
        backgroundImage: "linear-gradient(var(--color-aqua), var(--color-aqua))",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 88%",
        backgroundSize: reduce ? FULL : undefined,
      }}
      initial={reduce ? false : { backgroundSize: EMPTY }}
      whileInView={{ backgroundSize: FULL }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 1, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.span>
  );
}
