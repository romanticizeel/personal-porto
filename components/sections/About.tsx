"use client";

import { motion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import Image from "next/image";
import { Fragment, useRef } from "react";
import { DrawLine } from "@/components/motion/DrawLine";
import { Highlight } from "@/components/motion/Highlight";
import { Reveal } from "@/components/motion/Reveal";
import { RichReveal } from "@/components/motion/RichReveal";
import { ScrollBand } from "@/components/motion/ScrollBand";
import { ScrubText } from "@/components/motion/ScrubText";
import { CircleText } from "@/components/ui/CircleText";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Sparkle } from "@/components/ui/Sparkle";
import {
  aboutBand,
  aboutFacts,
  aboutParagraphs,
  aboutPullQuote,
  aboutStatement,
  portrait,
  skillGroups,
  softSkills,
  type RichSegment,
} from "@/lib/content";
import { drawX, EASE_OUT, fadeUp, slideIn, SPRING_POP, SPRING_SOFT, staggerChildren, VIEWPORT_ONCE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { usePointerParallax, useShift } from "@/lib/use-pointer-parallax";

/*
 * Motion plan for this section (the principles come from the motion.zajno.com reference):
 *
 *  - Masking + morph   the portrait is an arch drawn by a clip-path. It opens from a small arch to
 *                      full size while the photo inside zooms out and drifts with the scroll.
 *  - Offset + delay    everything arrives one after another: statement words, highlights, rows,
 *                      the toolbox columns and their items.
 *  - Parallax          scroll: photo, star, badge, sparkles and the two type rows all travel at
 *                      different speeds. Pointer: the photo, star and badge shift with the mouse.
 *  - Reading pace      the pull quote lights up word by word as it scrolls through the screen.
 *
 * Only transforms and opacity are animated (plus the clip-path, once). Scroll- and pointer-linked
 * layers are switched off with reduced motion; entrances fall back to MotionConfig's rules.
 */

/** The arch is a clip-path (not a border radius), so it can grow from a small arch to full size. */
const ARCH_SHAPE = "round 999px 999px 32px 32px";
const ARCH_CLOSED = `inset(26% 26% 26% 26% ${ARCH_SHAPE})`;
const ARCH_OPEN = `inset(0% 0% 0% 0% ${ARCH_SHAPE})`;

const factList = staggerChildren(0.09, 0.05);
const pillList = staggerChildren(0.06, 0.1);

/** One toolbox column: title, rule and items arrive in order; `custom` is the column index. */
const toolColumn: Variants = {
  hidden: {},
  visible: (column: number) => ({
    transition: { delayChildren: 0.08 + column * 0.12, staggerChildren: 0.045 },
  }),
};

/** Renders editorial text where `{ highlight }` segments get the animated highlighter mark. */
function Rich({ segments }: { segments: RichSegment[] }) {
  return (
    <>
      {segments.map((segment, i) =>
        typeof segment === "string" ? (
          <Fragment key={i}>{segment}</Fragment>
        ) : (
          <Highlight key={i} delay={0.15 + i * 0.08}>
            {segment.highlight}
          </Highlight>
        ),
      )}
    </>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const pointer = usePointerParallax();

  // One smoothed progress value (0 -> 1 while the section crosses the screen) drives every layer.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { ...SPRING_SOFT, restDelta: 0.0005 });

  // Scroll-linked layers. The photo is 18% taller than its arch and drifts inside it.
  const photoDrift = useTransform(progress, [0, 1], ["-7%", "7%"]);
  const starSpin = useTransform(progress, [0, 1], [-30, 150]);
  const badgeSpin = useTransform(progress, [0, 1], [0, -300]);
  const bigSparkleY = useTransform(progress, [0, 1], [-70, 110]);
  const bigSparkleSpin = useTransform(progress, [0, 1], [-15, 75]);
  const smallSparkleY = useTransform(progress, [0, 1], [70, -90]);
  const smallSparkleSpin = useTransform(progress, [0, 1], [20, -90]);

  // Pointer-linked layers: the photo sits furthest back and opposes the pointer, the star and
  // the badge are in front and move in opposite directions to each other.
  const photoX = useShift(pointer.x, -9);
  const photoY = useShift(pointer.y, -9);
  const starX = useShift(pointer.x, 16);
  const starY = useShift(pointer.y, 16);
  const badgeX = useShift(pointer.x, -14);
  const badgeY = useShift(pointer.y, -14);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className="relative z-0 pb-44 pt-28 lg:pb-56 lg:pt-40"
    >
      {/* ambient layer: blueprint columns and two slow sparkles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip">
        <div className="mx-auto h-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid-lines h-full border-x border-ink/10 [mask-image:linear-gradient(to_bottom,transparent,#000_10%,#000_82%,transparent)]" />
        </div>
        <motion.div
          style={reduce ? undefined : { y: bigSparkleY, rotate: bigSparkleSpin }}
          className="absolute -right-44 top-[20%] size-[30rem] text-aqua/45 md:size-[44rem]"
        >
          <Sparkle className="size-full" />
        </motion.div>
        <motion.div
          style={reduce ? undefined : { y: smallSparkleY, rotate: smallSparkleSpin }}
          className="absolute -left-28 bottom-[12%] size-60 text-lagoon/25 md:size-80"
        >
          <Sparkle className="size-full" />
        </motion.div>
      </div>

      <Container>
        <SectionLabel index="01" label="About" />
        <h2 id="about-title" className="sr-only">
          About Mellanda
        </h2>

        <div className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
          {/* portrait: stays pinned beside the story on desktop */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start xl:col-span-4">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <motion.div
                aria-hidden="true"
                style={reduce ? undefined : { x: starX, y: starY, rotate: starSpin }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ type: "spring", ...SPRING_POP, delay: 0.8 }}
                className="absolute -left-3 -top-5 z-20 size-20 text-seaglass sm:-left-6 sm:-top-6 md:size-24"
              >
                <Sparkle className="size-full" />
              </motion.div>

              <div className="relative aspect-[4/5]">
                {/* the frame's shadow fades in after the arch has opened */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-t-[999px] rounded-b-[2rem] shadow-frame"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: 0.9, delay: 0.7, ease: EASE_OUT }}
                />
                <motion.div
                  // overflow-hidden as well as the clip-path: a clip-path only hides pixels, it does
                  // not stop the zoomed photo from making the page scroll sideways on a phone.
                  className="absolute inset-0 overflow-hidden bg-lagoon"
                  initial={{ clipPath: ARCH_CLOSED }}
                  whileInView={{ clipPath: ARCH_OPEN }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ duration: reduce ? 0 : 1.5, delay: 0.1, ease: EASE_OUT }}
                >
                  <motion.div
                    style={reduce ? undefined : { y: photoDrift }}
                    className="absolute inset-x-0 -inset-y-[9%]"
                  >
                    <motion.div
                      style={reduce ? undefined : { x: photoX, y: photoY }}
                      // Settles at 1.08, not 1: the extra 4% on every side is the room the pointer
                      // shift needs, so the teal behind the photo never shows at the edges.
                      initial={{ scale: 1.4 }}
                      whileInView={{ scale: 1.08 }}
                      viewport={VIEWPORT_ONCE}
                      transition={{ duration: reduce ? 0 : 1.9, delay: 0.1, ease: EASE_OUT }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={portrait.src}
                        alt={portrait.alt}
                        fill
                        sizes="(min-width: 1280px) 420px, (min-width: 1024px) 38vw, 80vw"
                        className="object-cover"
                        style={{ objectPosition: "50% 36%" }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                aria-hidden="true"
                style={reduce ? undefined : { x: badgeX, y: badgeY }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ type: "spring", ...SPRING_POP, delay: 1 }}
                // overflow-hidden: a spinning square is wider than itself at 45 degrees, which
                // would otherwise let the page scroll sideways on a phone for part of each turn.
                className="absolute -bottom-8 -right-3 z-20 size-28 overflow-hidden rounded-full bg-ink text-lagoon shadow-frame sm:-right-6 md:size-32"
              >
                <motion.div style={reduce ? undefined : { rotate: badgeSpin }} className="size-full">
                  <CircleText
                    text="Backend developer • Malang • Golang • PHP • TypeScript • "
                    className="size-full"
                  />
                </motion.div>
                <Sparkle className="absolute left-1/2 top-1/2 size-[24%] -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
            </div>
          </div>

          {/* story */}
          <div className="lg:col-span-7 xl:col-span-8 xl:pl-10">
            <p className="font-display text-[clamp(2rem,3.9vw,3.9rem)] leading-[1.1] tracking-[-0.01em] text-balance">
              <RichReveal segments={aboutStatement} delay={0.2} />
            </p>

            <div className="mt-12 grid gap-x-10 gap-y-10 text-base leading-relaxed text-ink-muted md:grid-cols-2 md:text-[1.0625rem] lg:grid-cols-1 xl:grid-cols-2">
              {aboutParagraphs.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <p>
                    <Rich segments={paragraph} />
                  </p>
                </Reveal>
              ))}
              <blockquote className="relative pl-6 pt-9 font-display text-[1.7rem] italic leading-[1.2] text-ink md:text-[1.8rem]">
                <DrawLine axis="y" delay={0.1} className="absolute inset-y-0 left-0 w-0.5 bg-seaglass" />
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-0 select-none text-[4.5rem] not-italic leading-[0.9] text-aqua"
                >
                  “
                </span>
                <ScrubText text={aboutPullQuote} />
              </blockquote>
            </div>

            <div className="mt-16 xl:mt-20">
              <DrawLine className="h-px w-full bg-ink/15" />
              <motion.dl
                className="text-sm"
                variants={factList}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                {aboutFacts.map((fact) => (
                  <motion.div
                    key={fact.label}
                    variants={fadeUp}
                    className="grid grid-cols-[8rem_1fr] gap-4 border-b border-ink/15 py-3"
                  >
                    <dt className="eyebrow pt-0.5 text-ink-muted">{fact.label}</dt>
                    <dd className="leading-snug">{fact.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </div>
        </div>
      </Container>

      <ScrollBand className="mt-28 lg:mt-36" top={aboutBand.top} bottom={aboutBand.bottom} />

      <Container className="mt-24 lg:mt-32">
        <Reveal>
          <h3 className="eyebrow mb-8 flex items-center gap-4">
            <Sparkle className="size-3 text-deepsea" />
            Toolbox
            <DrawLine className="h-px flex-1 bg-ink/20" delay={0.2} />
          </h3>
        </Reveal>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              custom={i}
              variants={toolColumn}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <motion.h4 variants={fadeUp} className="eyebrow pb-3 text-fjord">
                {group.label}
              </motion.h4>
              <motion.span aria-hidden="true" variants={drawX} className="block h-px origin-left bg-ink/20" />
              <ul className="mt-4 space-y-1.5">
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    variants={slideIn}
                    className="group flex items-center gap-2 text-[15px] leading-snug transition-[translate] duration-300 ease-expo hover:translate-x-1 motion-reduce:transition-none"
                  >
                    <Sparkle className="size-2 shrink-0 text-seaglass opacity-0 transition-[opacity,rotate] duration-300 group-hover:rotate-90 group-hover:opacity-100" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="eyebrow mb-5 text-ink-muted">Working style</h3>
          </Reveal>
          <motion.ul
            className="flex flex-wrap gap-2"
            variants={pillList}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            {softSkills.map((skill) => (
              <motion.li
                key={skill}
                variants={fadeUp}
                className="cursor-default rounded-full border border-ink/25 px-4 py-1.5 text-sm transition-[translate,background-color,color,border-color] duration-300 ease-expo hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
              >
                {skill}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}
