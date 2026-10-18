"use client";

import { ArrowUpRight, Check, Copy, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Sparkle } from "@/components/ui/Sparkle";
import { profile } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/** Closing section: big statement, working email link, LinkedIn, copy-to-clipboard. */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access can be denied; the mailto link above still works.
    }
  }

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-title"
      className="on-dark relative isolate overflow-clip bg-ink pb-24 pt-28 text-paper lg:pb-32 lg:pt-40"
    >
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { rotate }}
        className="pointer-events-none absolute -bottom-72 -right-48 -z-10 size-[46rem] text-lagoon/10"
      >
        <Sparkle className="size-full" />
      </motion.div>

      <Container>
        <SectionLabel index="05" label="Contact" tone="dark" />

        <h2
          id="contact-title"
          className="font-display text-[clamp(3.25rem,10.5vw,10rem)] leading-[0.9] tracking-[-0.03em] text-balance"
        >
          <TextReveal text="Let’s work on" />{" "}
          <TextReveal text="something meaningful," delay={0.15} />{" "}
          <TextReveal text="together." delay={0.35} className="italic text-lagoon" />
        </h2>

        <Reveal className="mt-14 max-w-xl">
          <p className="text-lg leading-relaxed text-paper-muted">
            Always keen to take part in meaningful, collaborative projects, from backend services to full web
            applications. Email or LinkedIn is the best way to reach me.
          </p>
        </Reveal>

        <Reveal className="mt-10" delay={0.1}>
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-4 font-display text-[clamp(1.55rem,4.6vw,3.9rem)] leading-none [overflow-wrap:anywhere]"
          >
            <span className="relative">
              {profile.email}
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-px w-full origin-right scale-x-100 bg-lagoon transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-0 motion-reduce:transition-none"
              />
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-[0.75em] shrink-0 text-lagoon transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-center gap-3" delay={0.15}>
          <Magnetic>
            <Button
              href={profile.linkedin}
              external
              variant="solid-light"
              icon={<ArrowUpRight className="size-4" aria-hidden="true" />}
            >
              LinkedIn <span className="sr-only">(opens in a new tab)</span>
            </Button>
          </Magnetic>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-3 rounded-full border border-paper/40 px-6 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:bg-paper hover:text-ink"
          >
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Email copied" : "Copy email address"}
          </button>
          <span role="status" className="sr-only">
            {copied ? "Email address copied to the clipboard" : ""}
          </span>
          <p className="eyebrow ml-2 flex items-center gap-2 text-paper-muted">
            <MapPin className="size-3.5" aria-hidden="true" />
            {profile.location}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
