"use client";

import { motion } from "motion/react";
import { DURATION, EASE_OUT, VIEWPORT_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface DrawLineProps {
  /** Give it a size and a colour: "h-px w-full bg-ink/15" for a rule, "absolute inset-y-0 w-0.5 ..." for a bar. */
  className?: string;
  /** Seconds to wait once the line is in view. */
  delay?: number;
  /** "x" draws left to right, "y" draws top to bottom. */
  axis?: "x" | "y";
}

/** A hairline that draws itself (scale from one edge: transform only, so it never shifts layout). */
export function DrawLine({ className, delay = 0, axis = "x" }: DrawLineProps) {
  const horizontal = axis === "x";
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block", horizontal ? "origin-left" : "origin-top", className)}
      initial={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
      whileInView={horizontal ? { scaleX: 1 } : { scaleY: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: DURATION.slow, delay, ease: EASE_OUT }}
    />
  );
}
