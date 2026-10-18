"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { achievements, type Achievement } from "@/lib/content";
import { SPRING_SOFT } from "@/lib/motion";

function AchievementCard({ item, index }: { item: Achievement; index: number }) {
  const heading = item.award ? `${item.place}, ${item.award}` : item.place;
  const tilt = index % 2 === 0 ? -1.2 : 1.2;

  return (
    <article>
      <div className="flex items-end justify-between gap-6 border-b border-ink/20 pb-4">
        <span
          aria-hidden="true"
          className="font-display text-[clamp(6.5rem,13vw,11rem)] italic leading-[0.78] tracking-[-0.03em] text-deepsea"
        >
          {item.ordinal}
        </span>
        <span className="eyebrow pb-1 text-ink-muted">{item.year}</span>
      </div>

      <h3 className="mt-7 font-display text-3xl leading-tight tracking-[-0.01em] md:text-4xl">{heading}</h3>
      <p className="mt-2 text-lg">
        {item.event} <span className="text-ink-muted">({item.field})</span>
      </p>
      <p className="mt-1 text-ink-muted">{item.role}</p>

      <motion.a
        href={item.certificate.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View the full certificate: ${heading}, ${item.event} (opens in a new tab)`}
        style={{ rotate: tilt }}
        whileHover={{ rotate: 0, y: -8 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", ...SPRING_SOFT }}
        className="group relative mt-9 block overflow-hidden rounded-lg bg-white shadow-frame ring-1 ring-ink/10"
      >
        <Image
          src={item.certificate.src}
          alt={item.certificate.alt}
          width={item.certificate.width}
          height={item.certificate.height}
          sizes="(min-width: 1024px) 560px, (min-width: 768px) 45vw, 92vw"
          className="h-auto w-full"
        />
        <span className="eyebrow absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          Full certificate
          <ArrowUpRight className="size-3" aria-hidden="true" />
        </span>
      </motion.a>

      <p className="eyebrow mt-5 text-ink-muted">{item.awarded}</p>
      {item.issuer ? <p className="eyebrow mt-1.5 text-ink-muted">{item.issuer}</p> : null}
    </article>
  );
}

/** Understated by design: two results, two certificates, no embellishment. */
export function Achievements() {
  return (
    <section id="achievements" aria-labelledby="achievements-title" className="relative bg-mist py-28 lg:py-40">
      <Container>
        <SectionLabel index="04" label="Achievements" />
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <h2
            id="achievements-title"
            className="font-display text-[clamp(2.75rem,6.5vw,6rem)] leading-[0.95] tracking-[-0.02em] lg:col-span-7"
          >
            <TextReveal text="Achievements" className="italic text-deepsea" />
          </h2>
          <Reveal className="lg:col-span-5">
            <p className="max-w-sm text-ink-muted">Two competition results, each with its certificate.</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
          {achievements.map((item, index) => (
            <li key={item.id}>
              <Reveal delay={index * 0.12}>
                <AchievementCard item={item} index={index} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
