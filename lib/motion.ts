import type { Variants } from "motion/react";

/**
 * Shared motion language.
 *
 * One easing family, three durations and three spring presets are reused everywhere so the
 * whole site moves with the same character: fast start, long settle (an "expo-out" feel).
 * Only transform and opacity are animated by default, per the Motion performance guidance.
 */

/** Expo-out: confident entrance, long soft landing. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Symmetric ease for things that travel and return. */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
  fast: 0.35,
  base: 0.8,
  slow: 1.1,
} as const;

/** Gentle follow, used to smooth scroll-linked values. */
export const SPRING_SOFT = { stiffness: 120, damping: 24, mass: 0.9 };
/** Crisp UI response: nav pill, button press. */
export const SPRING_SNAPPY = { stiffness: 420, damping: 32 };
/** Magnetic pull towards the pointer. */
export const SPRING_MAGNET = { stiffness: 220, damping: 18, mass: 0.6 };
/** A small overshoot for ornaments (stars, badges) that pop into place once. */
export const SPRING_POP = { stiffness: 170, damping: 13, mass: 0.8 };

/** Fade and rise; the default entrance for blocks of content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** Fade in while sliding from the left; list items that arrive one after another. */
export const slideIn: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** A hairline that draws itself from its left edge (give it `origin-left`). */
export const drawX: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

/** Parent variant that staggers its children. */
export function staggerChildren(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
}

/** Viewport options shared by every whileInView reveal: play once, slightly before centre. */
export const VIEWPORT_ONCE = { once: true, margin: "0px 0px -10% 0px" } as const;
