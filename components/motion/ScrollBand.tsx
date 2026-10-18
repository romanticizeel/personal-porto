"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { Sparkle } from "@/components/ui/Sparkle";
import { SPRING_SOFT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

interface ScrollBandProps {
  /** Solid italic row: drifts left as the page scrolls down. */
  top: string[];
  /** Outlined row: drifts right, so the two rows pass each other. */
  bottom: string[];
  className?: string;
}

/** Enough copies of a row that the strip is always wider than the screen plus its travel. */
const COPIES = [0, 1, 2, 3];

function Row({ words, outlined }: { words: string[]; outlined?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center">
      {words.map((word) => (
        <li key={word} className="flex items-center">
          <span
            className={cn(
              "px-5 font-display text-[clamp(3rem,9vw,7.5rem)] leading-[1.05] md:px-9",
              outlined ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-deepsea)]" : "italic text-ink",
            )}
          >
            {word}
          </span>
          <Sparkle className={cn("size-5 shrink-0 md:size-8", outlined ? "text-deepsea" : "text-seaglass")} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Two rows of oversized type that slide past each other in opposite directions as you scroll.
 * They travel at the same pace in opposite directions, which reads as depth (parallax). It is
 * decorative: it only repeats technologies listed elsewhere, so it is hidden from assistive
 * tech, and it stands still with reduced motion. Travel is in vw so it behaves the same on
 * every screen width.
 */
export function ScrollBand({ top, bottom, className }: ScrollBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { ...SPRING_SOFT, restDelta: 0.0005 });
  const leftward = useTransform(progress, [0, 1], ["0vw", "-45vw"]);
  const rightward = useTransform(progress, [0, 1], ["-45vw", "0vw"]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("overflow-hidden pb-6 md:pb-10", className)}>
      <motion.div style={reduce ? undefined : { x: leftward }} className="flex w-max will-change-transform">
        {COPIES.map((copy) => (
          <Row key={copy} words={top} />
        ))}
      </motion.div>
      <motion.div style={reduce ? undefined : { x: rightward }} className="flex w-max will-change-transform">
        {COPIES.map((copy) => (
          <Row key={copy} words={bottom} outlined />
        ))}
      </motion.div>
    </div>
  );
}
