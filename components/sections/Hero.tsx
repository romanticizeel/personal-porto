"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ServiceTopology } from "@/components/diagrams/ServiceTopology";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Sparkle } from "@/components/ui/Sparkle";
import { BUILD_YEAR, profile, tickerItems } from "@/lib/content";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/use-media-query";

/**
 * Hero choreography (all times from page load):
 *   0.10s  eyebrow row fades up
 *   0.15s  first name rises out of its mask   0.30s  surname follows
 *   0.55s  role line     0.65s  intro     0.80s  CTAs
 *   0.35s  architecture arch settles; its edges draw from 0.9s, data pulses start at ~2.2s
 *   1.10s  technology ticker fades in
 * On scroll the name drifts up and the star rotates; on desktop the arch also drifts down,
 * giving depth. Stacked under the text (phones, tablets) the arch stays put: drifting down
 * would push its caption underneath the ticker.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const desktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  // Small on purpose: the arch column has only ~56px of room above the ticker, so a larger drift
  // would slide its caption underneath it.
  const archY = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const starRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const starY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 18 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.base, delay, ease: EASE_OUT },
  });

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-clip"
    >
      {/* decorative layers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid-lines h-full border-x border-ink/10" />
        </div>
        <motion.div
          style={reduce ? undefined : { rotate: starRotate, y: starY }}
          className="absolute -right-32 top-16 size-[26rem] text-lagoon/30 md:size-[40rem]"
        >
          <Sparkle className="size-full" />
        </motion.div>
      </div>

      <Container className="flex flex-1 flex-col justify-center pb-12 pt-28 lg:pb-14 lg:pt-32">
        <div className="grid items-center gap-x-8 gap-y-14 lg:grid-cols-12">
          <motion.div style={reduce ? undefined : { y: nameY }} className="lg:col-span-7">
            <motion.div {...enter(0.1)} className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-muted">
              <Sparkle className="size-3.5 text-deepsea" />
              <span>Portfolio {BUILD_YEAR}</span>
              <span aria-hidden="true" className="h-px w-10 bg-ink/30" />
              <span>{profile.location}</span>
            </motion.div>

            <h1
              id="hero-title"
              className="mt-8 font-display text-[clamp(4rem,18vw,6.5rem)] leading-[0.84] tracking-[-0.035em] md:text-[clamp(5rem,13vw,9rem)] lg:text-[clamp(5rem,10.8vw,10.5rem)]"
            >
              <TextReveal text={profile.firstName} trigger="mount" delay={0.15} />{" "}
              <TextReveal
                text={profile.lastName}
                trigger="mount"
                delay={0.3}
                className="pl-[0.38em] italic text-deepsea"
              />
            </h1>

            <motion.p {...enter(0.55)} className="mt-9 font-display text-2xl leading-tight md:text-3xl">
              <span className="italic">{profile.role}</span>
              <span className="font-sans text-base text-ink-muted md:text-lg"> with fullstack development experience</span>
            </motion.p>

            <motion.p
              {...enter(0.65)}
              className="mt-5 max-w-[34rem] text-base leading-relaxed text-ink-muted md:text-lg"
            >
              {profile.intro}
            </motion.p>

            <motion.div {...enter(0.8)} className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button href="#work" icon={<ArrowDown className="size-4" aria-hidden="true" />}>
                  Explore selected work
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="#contact" variant="outline" icon={<ArrowUpRight className="size-4" aria-hidden="true" />}>
                  Get in touch
                </Button>
              </Magnetic>
            </motion.div>

            <motion.p {...enter(0.95)} className="eyebrow mt-10 flex items-center gap-3 text-ink-muted">
              <span className="size-1.5 rounded-full bg-seaglass" aria-hidden="true" />
              <span>Currently: Backend Developer, {profile.current}</span>
            </motion.p>
          </motion.div>

          <motion.div style={reduce || !desktop ? undefined : { y: archY }} className="lg:col-span-5">
            <motion.figure
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.35, ease: EASE_OUT }}
              className="mx-auto w-full max-w-[24rem] lg:max-w-none"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-aqua shadow-frame">
                <div aria-hidden="true" className="bg-dots absolute inset-0" />
                <ServiceTopology className="absolute inset-0 size-full" />
              </div>
              <figcaption className="eyebrow mt-4 flex items-start justify-between gap-6 text-ink-muted">
                <span className="shrink-0 whitespace-nowrap">Fig. 01</span>
                <span className="text-right">Illustrative: the stack behind my ILC-BKPM work</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="on-dark border-y border-ink/20 bg-ink py-5 text-paper"
      >
        <Marquee items={tickerItems} />
      </motion.div>
    </section>
  );
}
