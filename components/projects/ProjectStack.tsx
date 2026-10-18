"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { ProjectPanel } from "@/components/projects/ProjectPanel";
import type { Project } from "@/lib/content";
import { usePileMode, useStackedMode } from "@/lib/use-media-query";
import { PILE_INSET_REM } from "@/lib/use-pile";
import { clamp, pad } from "@/lib/utils";

/**
 * Extra scroll, in viewport heights, after the last panel has pinned so it gets a moment of
 * its own. Must match the spacer height (`stack:h-[60svh]`) rendered below the panels.
 */
const DWELL = 0.6;

interface ProjectStackProps {
  projects: Project[];
  onOpen: (project: Project) => void;
}

/**
 * Scroll geometry (desktop): every panel wrapper is 100svh tall and sticky, so panel i pins
 * after i viewports of scrolling. Total travel = (n - 1 + DWELL) viewports, hence one panel
 * occupies `unit = 1 / (n - 1 + DWELL)` of the scroll progress measured on this container.
 * Each ProjectPanel derives its own scale / lift / dim from that single value.
 *
 * Also provided: a side rail (jump to any project), and keyboard support: focusing a control in
 * a covered panel scrolls that panel into place so focus is never invisible.
 *
 * Phones and tablets use the "pile" instead (lib/use-pile.ts): cards keep their own heights, so
 * none of the geometry above applies; each panel works out its own cover from its neighbour.
 * Only the keyboard support below needs to know where a card pins.
 */
export function ProjectStack({ projects, onOpen }: ProjectStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const stacked = useStackedMode();
  const pile = usePileMode();
  const total = projects.length;
  const unit = 1 / (total - 1 + DWELL);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!stacked) return;
    const next = clamp(Math.round(value / unit), 0, total - 1);
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = ref.current;
      if (!container) return;
      const top = container.getBoundingClientRect().top + window.scrollY;

      if (pile) {
        // Cards have their own heights here: add up the ones above to find where card `index`
        // starts, then scroll to the moment it pins (the next card has not begun to cover it).
        const cards = Array.from(container.querySelectorAll<HTMLElement>(":scope > article"));
        const card = cards[index];
        if (!card) return;
        const start = cards.slice(0, index).reduce((sum, c) => sum + c.offsetHeight, top);
        const inset = PILE_INSET_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
        const fits = card.offsetHeight <= window.innerHeight - inset;
        const target = fits ? start - inset : start + card.offsetHeight - window.innerHeight;
        window.scrollTo({ top: target, behavior });
        return;
      }

      // Panel i is pinned once i full viewports have scrolled past the container's top edge.
      window.scrollTo({ top: top + index * window.innerHeight, behavior });
    },
    [pile],
  );

  const onFocusPanel = useCallback(
    (index: number, target: HTMLElement) => {
      if (stacked) {
        if (index !== activeRef.current) scrollToIndex(index, "auto");
        return;
      }
      if (!pile) return;
      // Pile: if the topmost thing at the focused control belongs to another card, the control
      // is hidden under the card that covers it, so bring this card back on top.
      const box = target.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      const owner = hit?.closest("article");
      if (owner && owner !== target.closest("article")) scrollToIndex(index, "auto");
    },
    [stacked, pile, scrollToIndex],
  );

  return (
    <div ref={ref} className="relative">
      <nav
        aria-label="Projects"
        className="pointer-events-none absolute inset-y-0 left-0 z-30 hidden w-24 stack:block"
      >
        <ol className="pointer-events-auto sticky top-1/2 flex -translate-y-1/2 flex-col items-start gap-2.5 pl-5">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <button
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Project ${i + 1} of ${total}: ${project.title}`}
                aria-current={i === active ? "true" : undefined}
                className="group flex items-center gap-2 py-0.5 font-mono text-[11px] tabular-nums text-paper-muted transition-colors hover:text-paper aria-[current=true]:text-lagoon"
              >
                <span>{pad(i + 1)}</span>
                <span
                  aria-hidden="true"
                  className="h-px w-3 bg-current transition-all duration-300 group-hover:w-6 group-aria-[current=true]:w-8"
                />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {projects.map((project, index) => (
        <ProjectPanel
          key={project.slug}
          project={project}
          index={index}
          total={total}
          progress={scrollYProgress}
          unit={unit}
          stacked={stacked}
          pile={pile}
          onOpen={onOpen}
          onFocusPanel={onFocusPanel}
        />
      ))}

      {/* Dwell spacer so the final panel stays pinned for a moment (desktop stack only). */}
      <div aria-hidden="true" className="hidden stack:block stack:h-[60svh]" />
    </div>
  );
}
