"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { ScreenshotFrame } from "@/components/projects/ScreenshotFrame";
import type { Project } from "@/lib/content";
import { EASE_OUT, SPRING_SOFT } from "@/lib/motion";
import { usePile } from "@/lib/use-pile";
import { clamp, cn, pad } from "@/lib/utils";

interface ProjectPanelProps {
  project: Project;
  index: number;
  total: number;
  /** Scroll progress (0-1) of the whole stack, and how much of it one panel occupies. */
  progress: MotionValue<number>;
  unit: number;
  /** True when the pinned/stacked desktop experience is active. */
  stacked: boolean;
  /** True when the phone/tablet pile is active (see lib/use-pile.ts). */
  pile: boolean;
  onOpen: (project: Project) => void;
  onFocusPanel: (index: number, target: HTMLElement) => void;
}

/**
 * One project panel.
 *
 * Stacked mode (desktop, motion allowed): the wrapper is `position: sticky` (see the `stack`
 * custom variant in globals.css) so every panel pins to the same spot and the next one slides
 * over it. While panels are covered they scale down, drift up and dim, driven by a single
 * scroll value and expressed purely as transform/opacity.
 *
 * Pile mode (phone and tablet, motion allowed): the same covering effect, but every card keeps
 * its natural height and pins by its bottom edge, so nothing is ever cut off (lib/use-pile.ts).
 * Reduced motion renders the same markup as a normal vertical list.
 */
export function ProjectPanel({ project, index, total, progress, unit, stacked, pile, onOpen, onFocusPanel }: ProjectPanelProps) {
  const articleRef = useRef<HTMLElement>(null);
  // Pile mode: how far the next card has slid over this one (0 = not at all, 1 = fully).
  const covered = usePile(articleRef, pile, index === total - 1);
  // Stacked mode: how many panels currently cover this one (0 = on top, capped at 3 for a shallow deck).
  const deck = useTransform(progress, (v) => clamp((v - index * unit) / unit, 0, 3));
  // Whichever mode is active drives the same scale / lift / dim below.
  const depth = useTransform([deck, covered], ([inDeck, inPile]: number[]) => (stacked ? inDeck : pile ? inPile : 0));
  const scale = useTransform(depth, (d) => 1 - d * 0.045);
  const lift = useTransform(depth, (d) => -d * 18);
  const dim = useTransform(depth, (d) => Math.min(d, 1) * 0.55 + clamp(d - 1, 0, 2) * 0.12);
  // 0 -> 1 while this panel slides in from below; its media lags behind for a parallax feel.
  const entering = useTransform(progress, (v) => clamp((v - (index - 1) * unit) / unit, 0, 1));
  const mediaLag = useTransform(entering, (e) => (1 - e) * 70);

  const { layout } = project;
  const mediaFirst = layout === "frame-left" || layout === "bleed-left";
  const tilt = layout === "frame-left" ? 1.4 : -1.4;
  const position = pad(index + 1);

  const text = <PanelText project={project} index={index} total={total} onOpen={onOpen} />;

  return (
    <article
      ref={articleRef}
      data-tone={project.tone}
      aria-labelledby={`project-${project.slug}`}
      onFocusCapture={(event) => onFocusPanel(index, event.target as HTMLElement)}
      className="relative px-4 py-3 sm:px-6 data-[pile=on]:sticky data-[pile=on]:top-[min(5rem,calc(100dvh_-_var(--pile-h,0px)))] stack:sticky stack:top-0 stack:flex stack:h-svh stack:items-center stack:justify-center stack:px-0 stack:py-0"
    >
      <motion.div
        style={stacked || pile ? { scale, y: lift, transformOrigin: "50% 0%" } : undefined}
        className={cn(
          "panel relative isolate mx-auto w-full max-w-[1280px] overflow-hidden rounded-[1.75rem] shadow-card ring-1 ring-paper/10 stack:h-[min(80svh,780px)] stack:max-w-none stack:w-[min(1280px,calc(100%-13rem))]",
          pile && "will-change-transform",
        )}
      >
        <motion.div
          className="relative h-full"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          {layout === "wide" ? (
            <div className="flex h-full flex-col">
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-6 lg:pt-10">
                <PanelHeading project={project} index={index} total={total} className="lg:col-span-5" />
                <PanelBody project={project} onOpen={onOpen} className="lg:col-span-7" />
              </div>
              <div className="relative order-first overflow-hidden px-5 pt-5 sm:px-8 lg:order-none lg:px-10 lg:pt-0 stack:min-h-0 stack:flex-1">
                <span
                  aria-hidden="true"
                  className="panel-numeral pointer-events-none absolute right-6 top-0 select-none font-display text-[clamp(8rem,16vw,15rem)] leading-none"
                >
                  {position}
                </span>
                <motion.div style={stacked ? { y: mediaLag } : undefined} className="relative mx-auto w-full max-w-[1120px]">
                  <ScreenshotFrame
                    image={project.image}
                    label={`${project.title} · screenshot`}
                    sizes="(min-width: 1280px) 1120px, 92vw"
                    className="lg:rounded-b-none"
                  />
                </motion.div>
              </div>
            </div>
          ) : layout === "bleed-right" || layout === "bleed-left" ? (
            <div className="grid h-full lg:grid-cols-2">
              <div className={cn("relative min-h-64 overflow-hidden", mediaFirst ? "lg:order-1" : "lg:order-2")}>
                <motion.div style={stacked ? { y: mediaLag } : undefined} className="absolute inset-x-0 -inset-y-[4%]">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 1280px) 620px, (min-width: 1024px) 45vw, 92vw"
                    className="object-cover"
                    style={{ objectPosition: project.image.objectPosition ?? "0% 0%" }}
                  />
                </motion.div>
              </div>
              <div className={cn(mediaFirst ? "lg:order-2" : "lg:order-1")}>{text}</div>
            </div>
          ) : (
            <div className="grid h-full lg:grid-cols-12">
              <div
                className={cn(
                  "relative flex items-center justify-center overflow-hidden px-5 pt-5 sm:px-8 sm:pt-8 lg:col-span-7 lg:p-10",
                  mediaFirst ? "lg:order-1" : "lg:order-2",
                )}
              >
                <div aria-hidden="true" className="bg-dots absolute inset-0 opacity-40" />
                <span
                  aria-hidden="true"
                  className={cn(
                    "panel-numeral pointer-events-none absolute -bottom-6 select-none font-display text-[clamp(9rem,18vw,17rem)] leading-none",
                    mediaFirst ? "right-4" : "left-4",
                  )}
                >
                  {position}
                </span>
                <motion.div style={stacked ? { y: mediaLag } : undefined} className="relative w-full">
                  <motion.div
                    style={{ rotate: stacked ? tilt : 0 }}
                    whileHover={{ rotate: 0, y: -6 }}
                    transition={{ type: "spring", ...SPRING_SOFT }}
                  >
                    <ScreenshotFrame
                      image={project.image}
                      label={`${project.title} · screenshot`}
                      sizes="(min-width: 1280px) 760px, (min-width: 1024px) 55vw, 92vw"
                    />
                  </motion.div>
                </motion.div>
              </div>
              <div className={cn("lg:col-span-5", mediaFirst ? "lg:order-2" : "lg:order-1")}>{text}</div>
            </div>
          )}
        </motion.div>

        {stacked || pile ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 bg-ink"
            style={{ opacity: dim }}
          />
        ) : null}
      </motion.div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

interface PanelPartProps {
  project: Project;
  className?: string;
}

/** Index, domain, title and subtitle. */
function PanelHeading({ project, index, total, className }: PanelPartProps & { index: number; total: number }) {
  return (
    <div className={className}>
      <p className="eyebrow flex items-center gap-3">
        <span>
          {pad(index + 1)}
          <span aria-hidden="true"> / {pad(total)}</span>
          <span className="sr-only"> of {pad(total)}</span>
        </span>
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
        <span className="panel-muted">{project.domain}</span>
      </p>
      <h3
        id={`project-${project.slug}`}
        className="mt-5 font-display text-[clamp(2.4rem,min(4.6vw,7.4svh),4.6rem)] leading-[0.95] tracking-[-0.02em] text-balance"
      >
        {project.title}
      </h3>
      <p className="panel-muted mt-3 text-sm">{project.subtitle}</p>
    </div>
  );
}

/** Blurb, role, technology chips and the detail button. */
function PanelBody({ project, onOpen, className }: PanelPartProps & { onOpen: (project: Project) => void }) {
  return (
    <div className={className}>
      <p className="max-w-[34rem] text-[0.95rem] leading-relaxed lg:text-base">{project.blurb}</p>
      <p className="mt-4 max-w-[34rem] text-sm leading-snug">
        <span className="eyebrow panel-muted mr-2">My role</span>
        {project.role}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((item) => (
          <li key={item} className="panel-chip rounded-full px-3 py-1 text-xs">
            {item}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-haspopup="dialog"
        className="panel-btn group mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-transform duration-300 hover:scale-[1.03] motion-reduce:transition-none"
      >
        Role &amp; contributions
        <span className="sr-only"> for {project.title}</span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
}

/** Heading + body stacked in one column (used by the split layouts). */
function PanelText({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (project: Project) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10 xl:p-12">
      <PanelHeading project={project} index={index} total={total} />
      <PanelBody project={project} onOpen={onOpen} />
    </div>
  );
}
