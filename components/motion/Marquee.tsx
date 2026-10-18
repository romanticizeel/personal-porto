import type { CSSProperties } from "react";
import { Sparkle } from "@/components/ui/Sparkle";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
}

/**
 * Endless technology ticker. The loop is a CSS transform animation (compositor-only), defined
 * in globals.css: it pauses on hover/focus and becomes a static wrapped list under reduced
 * motion. The duplicate row is hidden from assistive tech.
 */
export function Marquee({ items, className, duration = 48 }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className={hidden ? "marquee-dup" : undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 font-display text-3xl italic leading-none md:px-8 md:text-4xl">{item}</span>
          <Sparkle className="size-3 shrink-0 text-lagoon md:size-3.5" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("marquee overflow-hidden", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
