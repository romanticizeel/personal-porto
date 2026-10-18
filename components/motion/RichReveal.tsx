"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, useMemo } from "react";
import { Highlight } from "@/components/motion/Highlight";
import { MaskedWord } from "@/components/motion/TextReveal";
import type { RichSegment } from "@/lib/content";
import { VIEWPORT_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RichRevealProps {
  segments: RichSegment[];
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
}

interface Piece {
  text: string;
  highlight: boolean;
}

/**
 * Splits editorial segments into "units": a word plus any punctuation stuck to it, so a comma
 * can never wrap onto a line of its own. A highlighted phrase becomes one unit per word.
 */
function toUnits(segments: RichSegment[]): Piece[][] {
  const units: Piece[][] = [];
  let current: Piece[] = [];
  const flush = () => {
    if (current.length > 0) units.push(current);
    current = [];
  };

  for (const segment of segments) {
    if (typeof segment !== "string") {
      const words = segment.highlight.split(/\s+/).filter(Boolean);
      words.forEach((text, i) => {
        current.push({ text, highlight: true });
        if (i < words.length - 1) flush();
      });
      continue;
    }
    for (const chunk of segment.split(/(\s+)/)) {
      if (chunk === "") continue;
      if (/^\s+$/.test(chunk)) flush();
      else current.push({ text: chunk, highlight: false });
    }
  }
  flush();
  return units;
}

/**
 * TextReveal for editorial copy: every word rises out of its own mask (offset and delay, one
 * after another), and once a highlighted word has landed its marker is drawn underneath.
 *
 * Accessibility: the animated copy is aria-hidden and a screen-reader-only copy carries the
 * real sentence. With reduced motion the words simply appear.
 */
export function RichReveal({ segments, className, delay = 0, stagger = 0.045 }: RichRevealProps) {
  const units = useMemo(() => toUnits(segments), [segments]);
  const plain = segments.map((s) => (typeof s === "string" ? s : s.highlight)).join("");
  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  return (
    <>
      <span className="sr-only">{plain}</span>
      <motion.span
        aria-hidden="true"
        className={cn("block", className)}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        {units.map((unit, i) => (
          <Fragment key={i}>
            <MaskedWord>
              {unit.map((piece, j) =>
                piece.highlight ? (
                  // The word's own stagger already decides when this mounts into view, so the mark
                  // only needs a short, fixed beat after the word has landed.
                  <Highlight key={j} delay={0.25}>
                    {piece.text}
                  </Highlight>
                ) : (
                  <Fragment key={j}>{piece.text}</Fragment>
                ),
              )}
            </MaskedWord>{" "}
          </Fragment>
        ))}
      </motion.span>
    </>
  );
}
