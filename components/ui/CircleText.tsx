"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface CircleTextProps {
  text: string;
  className?: string;
}

/**
 * Text set around a circle (SVG textPath). The caller spins it. Decorative, so it is hidden from
 * assistive tech. The text is stretched to fill the circle exactly (textLength), which keeps
 * the seam tidy for any copy that is a little shorter than the circumference.
 */
export function CircleText({ text, className }: CircleTextProps) {
  // useId output can contain characters that are awkward inside a url fragment.
  const pathId = `circle-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" className={cn("font-mono", className)}>
      <defs>
        <path id={pathId} d="M60 60 m-45 0 a45 45 0 1 1 90 0 a45 45 0 1 1 -90 0" />
      </defs>
      <text fill="currentColor" fontSize="8" letterSpacing="0.4">
        <textPath href={`#${pathId}`} textLength="280">
          {text.toUpperCase()}
        </textPath>
      </text>
    </svg>
  );
}
