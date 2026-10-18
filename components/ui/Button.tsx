"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_SNAPPY } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "solid-light" | "outline-light";

/*
 * Each variant = resting style + a fill layer that sweeps up on hover/focus + the text colour
 * it flips to. Full class names are spelled out so Tailwind can detect them.
 */
const VARIANTS: Record<Variant, { base: string; fill: string; flip: string }> = {
  solid: {
    base: "bg-ink text-paper",
    fill: "bg-seaglass",
    flip: "group-hover:text-ink group-focus-visible:text-ink",
  },
  outline: {
    base: "border border-ink/40 text-ink",
    fill: "bg-ink",
    flip: "group-hover:text-paper group-focus-visible:text-paper",
  },
  "solid-light": {
    base: "bg-paper text-ink",
    fill: "bg-lagoon",
    flip: "",
  },
  "outline-light": {
    base: "border border-paper/40 text-paper",
    fill: "bg-paper",
    flip: "group-hover:text-ink group-focus-visible:text-ink",
  },
};

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  /** Opens in a new tab with a safe rel. */
  external?: boolean;
  className?: string;
}

/** Pill link-button with a sweep-fill hover and a springy press. */
export function Button({ href, children, variant = "solid", icon, external, className }: ButtonProps) {
  const v = VARIANTS[variant];
  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", ...SPRING_SNAPPY }}
      className={cn(
        "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium tracking-wide",
        v.base,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 translate-y-full rounded-[inherit] transition-transform duration-500 ease-expo group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none",
          v.fill,
        )}
      />
      <span className={cn("relative z-10 inline-flex items-center gap-3 transition-colors duration-300", v.flip)}>
        {children}
        {icon}
      </span>
    </motion.a>
  );
}
