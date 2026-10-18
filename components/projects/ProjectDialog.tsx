"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { ScreenshotFrame } from "@/components/projects/ScreenshotFrame";
import { Sparkle } from "@/components/ui/Sparkle";
import type { Project } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";
import { pad } from "@/lib/utils";

interface ProjectDialogProps {
  project: Project | null;
  /** All projects, only used to print "03 / 08". */
  projects: Project[];
  onClose: () => void;
}

/**
 * Project detail sheet built on the native <dialog> element.
 *
 * showModal() gives us, for free and correctly: a focus trap, inert background, top-layer
 * rendering (so the transformed, stacked panels cannot clip it), Escape handling and focus
 * return to the trigger. Motion only animates the content; Escape is intercepted so the exit
 * animation can play before the dialog is really closed.
 */
export function ProjectDialog({ project, projects, onClose }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !project) return;
    if (!dialog.open) dialog.showModal();

    // Native modal dialogs do not lock page scroll; do it here (scrollbar-gutter keeps layout stable).
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [project]);

  const position = project ? `${pad(projects.indexOf(project) + 1)} / ${pad(projects.length)}` : "";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="project-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        // Closed by something other than our own state (e.g. a browser "close watcher").
        if (project) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-ink open:flex open:items-center open:justify-center"
    >
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {project
          ? [
              <motion.div
                key="backdrop"
                aria-hidden="true"
                className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                onClick={onClose}
              />,
              <motion.div
                key="panel"
                className="relative z-10 mx-4 flex max-h-[min(92svh,920px)] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] bg-paper text-ink shadow-frame"
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <div className="flex items-start justify-between gap-6 border-b border-ink/15 p-6 md:p-8">
                  <div>
                    <p className="eyebrow flex items-center gap-3 text-ink-muted">
                      <Sparkle className="size-3 text-deepsea" />
                      <span>{position}</span>
                      <span aria-hidden="true" className="h-px w-8 bg-ink/30" />
                      <span>{project.domain}</span>
                    </p>
                    <h3
                      id="project-dialog-title"
                      className="mt-4 font-display text-4xl leading-none tracking-[-0.02em] md:text-6xl"
                    >
                      {project.title}
                    </h3>
                    <p className="mt-2 text-ink-muted">{project.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    autoFocus
                    onClick={onClose}
                    aria-label="Close project details"
                    className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-paper"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="overflow-y-auto overscroll-contain p-6 md:p-8">
                  <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                      <ScreenshotFrame
                        image={project.image}
                        label={`${project.title} · screenshot`}
                        sizes="(min-width: 1024px) 640px, 90vw"
                      />
                    </div>
                    <div className="lg:col-span-5">
                      <h4 className="eyebrow text-fjord">About the project</h4>
                      <p className="mt-4 text-base leading-relaxed">{project.summary}</p>
                      <h4 className="eyebrow mt-8 text-fjord">Technology</h4>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {project.tech.map((item) => (
                          <li key={item} className="rounded-full bg-ink/[0.07] px-3 py-1 text-xs">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h4 className="eyebrow mt-10 text-fjord">What I worked on</h4>
                  <ol className="mt-3 divide-y divide-ink/15 border-y border-ink/15">
                    {project.contributions.map((item, i) => (
                      <li key={item} className="grid grid-cols-[2.25rem_1fr] gap-3 py-3 text-[15px] leading-relaxed">
                        <span className="eyebrow pt-1 text-ink-muted">{pad(i + 1)}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>,
            ]
          : null}
      </AnimatePresence>
    </dialog>
  );
}
