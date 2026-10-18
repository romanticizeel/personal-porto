import type { SVGProps } from "react";

/**
 * The portfolio's ornament: a four-point star with concave sides.
 * It echoes the sparkle used in Mellanda's own portfolio PDF and is reused as monogram,
 * list marker and large background shape. Colour comes from `currentColor`.
 */
export function Sparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" {...props}>
      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
    </svg>
  );
}
