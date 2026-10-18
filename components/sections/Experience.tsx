"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Sparkle } from "@/components/ui/Sparkle";
import {
  education,
  experience,
  type EducationItem,
  type ExperienceItem,
  type TimelineKind,
} from "@/lib/content";
import { SPRING_SOFT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/** One shape per kind so employment, internships and education are told apart at a glance. */
function Marker({ kind }: { kind: TimelineKind }) {
  const base = "absolute -left-7 top-[2.4rem] size-3.5 -translate-x-1/2 ring-4 ring-paper";
  if (kind === "employment") return <span aria-hidden="true" className={cn(base, "rounded-full bg-deepsea")} />;
  if (kind === "internship")
    return <span aria-hidden="true" className={cn(base, "rounded-full border-2 border-deepsea bg-paper")} />;
  return <span aria-hidden="true" className={cn(base, "rotate-45 border-2 border-ink bg-paper")} />;
}

/** Vertical rail whose teal fill grows as the list scrolls through the viewport. */
function TimelineList({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { ...SPRING_SOFT, restDelta: 0.001 });

  return (
    <ol ref={ref} aria-label={label} className="relative pl-7">
      <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-ink/15" />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-[-0.5px] top-0 w-[2px] origin-top bg-deepsea"
        style={{ scaleY: reduce ? 1 : fill }}
      />
      {children}
    </ol>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <Sparkle className="mt-[0.5em] size-2.5 shrink-0 text-seaglass" />
      <span>{children}</span>
    </li>
  );
}

function ExperienceEntry({ item }: { item: ExperienceItem }) {
  return (
    <li className="relative border-t border-ink/15 py-10 first:border-t-0 md:grid md:grid-cols-[10.5rem_1fr] md:gap-10">
      <Marker kind={item.kind} />
      <div className="mb-5 md:mb-0">
        <Reveal>
          <p className="eyebrow">{item.period}</p>
          <p className="eyebrow mt-3 inline-block rounded-full border border-ink/25 px-3 py-1 text-ink-muted">
            {item.employmentType}
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.05}>
        <h4 className="font-display text-3xl leading-tight tracking-[-0.01em] md:text-4xl">{item.organization}</h4>
        <p className="mt-1.5 text-ink-muted">
          {item.role}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {item.location}
        </p>
        <ul className="mt-6 space-y-3 text-[15px] leading-relaxed">
          {item.points.map((point) => (
            <Bullet key={point}>{point}</Bullet>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {item.tech.map((tech) => (
            <li key={tech} className="rounded-full border border-ink/20 px-3 py-1 text-xs">
              {tech}
            </li>
          ))}
        </ul>
      </Reveal>
    </li>
  );
}

function EducationEntry({ item }: { item: EducationItem }) {
  return (
    <li className="relative border-t border-ink/15 py-10 first:border-t-0 md:grid md:grid-cols-[10.5rem_1fr] md:gap-10">
      <Marker kind="education" />
      <div className="mb-5 md:mb-0">
        <Reveal>
          <p className="eyebrow">{item.period}</p>
          <p className="eyebrow mt-3 inline-block rounded-full border border-ink/25 px-3 py-1 text-ink-muted">
            Education
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.05}>
        <h4 className="font-display text-3xl leading-tight tracking-[-0.01em] md:text-4xl">{item.organization}</h4>
        <p className="mt-1.5 text-ink-muted">{item.program}</p>
        {item.note ? <p className="mt-5 max-w-xl text-[15px] leading-relaxed">{item.note}</p> : null}
      </Reveal>
    </li>
  );
}

function GroupHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("eyebrow mb-2 flex items-center gap-4 text-fjord", className)}>
      {children}
      <span aria-hidden="true" className="h-px flex-1 bg-ink/15" />
    </h3>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-28 lg:py-40">
      <Container>
        <SectionLabel index="03" label="Experience" />
        <div className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h2
                id="experience-title"
                className="font-display text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em]"
              >
                <TextReveal text="Experience" />{" "}
                <TextReveal text="& education" delay={0.1} className="italic text-deepsea" />
              </h2>
              <Reveal>
                <p className="mt-6 max-w-xs text-ink-muted">
                  Roles, internships and studies, most recent first. Dates are shown exactly as they appear on my
                  CV, overlaps included.
                </p>
                <ul className="mt-8 space-y-3 text-sm" aria-label="Legend">
                  <li className="flex items-center gap-3">
                    <span aria-hidden="true" className="size-3 rounded-full bg-deepsea" />
                    Employment
                  </li>
                  <li className="flex items-center gap-3">
                    <span aria-hidden="true" className="size-3 rounded-full border-2 border-deepsea" />
                    Internship
                  </li>
                  <li className="flex items-center gap-3">
                    <span aria-hidden="true" className="size-3 rotate-45 border-2 border-ink" />
                    Education
                  </li>
                </ul>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            <GroupHeading>Work experience</GroupHeading>
            <TimelineList label="Work experience">
              {experience.map((item) => (
                <ExperienceEntry key={item.id} item={item} />
              ))}
            </TimelineList>

            <GroupHeading className="mt-20">Education</GroupHeading>
            <TimelineList label="Education">
              {education.map((item) => (
                <EducationEntry key={item.id} item={item} />
              ))}
            </TimelineList>
          </div>
        </div>
      </Container>
    </section>
  );
}
