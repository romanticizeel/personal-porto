"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * App-wide Motion settings.
 *
 * reducedMotion="user" makes Motion honour the OS "reduce motion" preference everywhere:
 * transform and layout animations are skipped (elements simply appear in place) while
 * opacity and colour changes remain. Scroll-linked values are gated separately with
 * usePrefersReducedMotion, because they are bound to styles rather than animated.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
