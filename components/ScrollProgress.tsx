"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { SPRING_SOFT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/** Hairline reading-progress bar fixed to the top of the viewport. */
export function ScrollProgress() {
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { ...SPRING_SOFT, restDelta: 0.0005 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-seaglass"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  );
}
