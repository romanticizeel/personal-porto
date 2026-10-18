"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

interface ScrubTextProps {
  text: string;
  className?: string;
  /** Opacity of a word the reader has not reached yet. */
  floor?: number;
}

/** Share of the scroll range one word takes to fade in; neighbouring words overlap. */
const WINDOW = 0.2;

interface ScrubWordProps {
  word: string;
  index: number;
  count: number;
  progress: MotionValue<number>;
  floor: number;
  reduce: boolean;
}

function ScrubWord({ word, index, count, progress, floor, reduce }: ScrubWordProps) {
  const start = (index / count) * (1 - WINDOW);
  const opacity = useTransform(progress, [start, start + WINDOW], [floor, 1]);
  // Reduced motion gets a plain span, not a motion one: the server renders every word at the dim
  // starting opacity, and only swapping the element reliably drops that for good.
  if (reduce) return <span>{word}</span>;
  return <motion.span style={{ opacity }}>{word}</motion.span>;
}

/**
 * Reading-pace text: the words fade from dim to full as the block scrolls up the screen, one
 * after another, so the eye is led through the sentence. Opacity only, driven by scroll
 * position (no scroll hijacking); with reduced motion every word is fully visible.
 */
export function ScrubText({ text, className, floor = 0.2 }: ScrubTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = text.split(" ");

  return (
    <span ref={ref} className={cn("block", className)}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <ScrubWord
            word={word}
            index={i}
            count={words.length}
            progress={scrollYProgress}
            floor={floor}
            reduce={reduce}
          />{" "}
        </Fragment>
      ))}
    </span>
  );
}
