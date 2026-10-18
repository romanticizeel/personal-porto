"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { ProjectStack } from "@/components/projects/ProjectStack";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects, type Project } from "@/lib/content";

/**
 * Selected work. An ink "sheet" rises over the About section (rounded top edge, slight
 * overlap), then the eight projects stack over one another as you scroll. No ancestor of the
 * sticky panels uses overflow: hidden/auto (that would break position: sticky).
 */
export function Work() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="on-dark relative z-10 -mt-12 rounded-[2.5rem] bg-ink pb-12 pt-28 text-paper lg:pt-36"
    >
      <Container>
        <SectionLabel index="02" label="Selected work" tone="dark" />
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h2
            id="work-title"
            className="font-display text-[clamp(3.25rem,9.5vw,8.75rem)] leading-[0.9] tracking-[-0.03em] lg:col-span-8"
          >
            <TextReveal text="Selected" display="inline" />{" "}
            <TextReveal text="work" display="inline" delay={0.12} className="italic text-lagoon" />
          </h2>
          <Reveal className="lg:col-span-4">
            <p className="max-w-sm text-paper-muted">
              {projects.length} projects across web platforms, business systems and backend services.
              <span className="motion-reduce:hidden"> Scroll: each one stacks over the last.</span>
            </p>
          </Reveal>
        </div>
      </Container>

      <div className="mt-14 lg:mt-20">
        <ProjectStack projects={projects} onOpen={setSelected} />
      </div>

      <ProjectDialog project={selected} projects={projects} onClose={() => setSelected(null)} />
    </section>
  );
}
