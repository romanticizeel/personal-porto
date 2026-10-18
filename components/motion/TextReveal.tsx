"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, type ReactNode } from "react";
import { EASE_OUT, VIEWPORT_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** "mount" plays immediately (hero); "view" waits until the text scrolls into view. */
  trigger?: "mount" | "view";
  /** "block" puts the text on its own line; "inline" lets several reveals share a line. */
  display?: "block" | "inline";
}

const word: Variants = {
  hidden: { y: "118%" },
  visible: { y: "0%", transition: { duration: 1, ease: EASE_OUT } },
};

/**
 * One word (or a short unit, like a word with its comma) rising out of its own clipping box.
 * It takes its "hidden" / "visible" labels from the nearest animated parent, so it has to sit
 * inside TextReveal, RichReveal or a container with the same variants.
 */
export function MaskedWord({ children }: { children: ReactNode }) {
  return (
    // The mask box has a little padding (cancelled by negative margin) so descenders and
    // italic overhangs are not clipped.
    <span className="-mx-[0.06em] -mb-[0.16em] -mt-[0.06em] inline-block overflow-hidden px-[0.06em] pb-[0.16em] pt-[0.06em] align-top">
      <motion.span className="inline-block will-change-transform" variants={word}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Word-by-word mask reveal: every word rises out of its own clipping box.
 *
 * Accessibility: the animated copy is aria-hidden and a screen-reader-only copy carries the
 * real text, so assistive tech never reads fragmented words. With reduced motion the
 * transform is skipped by MotionConfig and the words simply appear.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.07,
  trigger = "view",
  display = "block",
}: TextRevealProps) {
  const words = text.split(" ");
  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  const triggerProps =
    trigger === "mount"
      ? ({ initial: "hidden", animate: "visible" } as const)
      : ({ initial: "hidden", whileInView: "visible", viewport: VIEWPORT_ONCE } as const);

  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className={cn(display === "block" ? "block" : "inline", className)}
        variants={container}
        {...triggerProps}
      >
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            <MaskedWord>{w}</MaskedWord>{" "}
          </Fragment>
        ))}
      </motion.span>
    </>
  );
}
