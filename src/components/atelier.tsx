"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Dictionary } from "@content/types";
import { RevealTitle } from "@/components/ui";
import { ClockWidget, RadarWidget, ResponseWidget, StackOrbit } from "@/components/widgets";
import { fluid } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Tuile en verre : une lueur suit le pointeur sous la surface, comme une lampe derrière une vitre. */
function Tile({
  children,
  className,
  order = 0,
}: {
  children: ReactNode;
  className?: string;
  order?: number;
}) {
  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  return (
    <motion.div
      onPointerMove={onMove}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.97, filter: "blur(10px)" },
        shown: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 1, ease: fluid, delay: order * 0.07 },
          transitionEnd: { filter: "none" },
        },
      }}
      className={cn(
        "glass group relative overflow-hidden rounded-[32px] p-6 md:p-8",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),var(--halo-a),transparent_70%)]",
        className,
      )}
    >
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

export function Atelier({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="a-propos"
      className="scroll-mt-20 px-3 py-24 md:px-6 md:py-36"
      aria-labelledby="a-propos-title"
    >
      <motion.div
        className="mx-auto grid max-w-[1320px] gap-3 md:grid-cols-12 md:gap-4"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.12 }}
      >
        <Tile className="md:col-span-7 md:row-span-2" order={0}>
          <div className="flex h-full flex-col">
            <p className="text-sm text-muted">{dict.about.index}</p>
            <RevealTitle
              id="a-propos-title"
              text={dict.about.title}
              className="display mt-4 max-w-[13ch] text-[clamp(2.4rem,5vw,4.6rem)]"
            />
            <div className="mt-auto grid gap-4 pt-10 md:grid-cols-2 md:gap-6">
              {dict.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[16px] leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Tile>

        <Tile className="md:col-span-5" order={1}>
          <ClockWidget dict={dict} />
        </Tile>

        <Tile className="min-h-[220px] md:col-span-3" order={2}>
          <RadarWidget dict={dict} />
        </Tile>

        <Tile className="md:col-span-2" order={3}>
          <ResponseWidget dict={dict} />
        </Tile>

        <Tile className="orbit-host md:col-span-8" order={4}>
          <StackOrbit dict={dict} />
        </Tile>

        <Tile className="md:col-span-4" order={5}>
          <dl className="grid h-full content-between gap-6">
            {dict.about.facts.map((fact) => (
              <div
                key={fact.k}
                className="flex items-baseline justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0"
              >
                <dt className="text-sm text-muted">{fact.k}</dt>
                <dd className="display text-right text-2xl md:text-3xl">{fact.v}</dd>
              </div>
            ))}
          </dl>
        </Tile>

        {dict.journey.services.map((service, index) => (
          <Tile key={service.title} className="md:col-span-4" order={6 + index}>
            <div className="flex h-full flex-col">
              <ServiceGlyph index={index} />
              <h3 className="display mt-10 text-3xl">{service.title}</h3>
              <p className="mt-3 text-muted">{service.text}</p>
            </div>
          </Tile>
        ))}
      </motion.div>
    </section>
  );
}

/** Pictogrammes construits avec la même lame que le logo : une, plusieurs, recomposées. */
function ServiceGlyph({ index }: { index: number }) {
  const counts = [1, 6, 12];
  const count = counts[index] ?? 1;
  return (
    <svg
      viewBox="-24 -24 48 48"
      className="size-12 transition-transform duration-700 ease-fluid group-hover:rotate-[60deg]"
      aria-hidden
    >
      {Array.from({ length: count }, (_, blade) => (
        <polygon
          key={blade}
          points="6,-2 22,-4 22,4 6,2"
          fill="currentColor"
          opacity={count === 1 ? 1 : 0.35 + (blade / count) * 0.65}
          transform={`rotate(${(blade / count) * 360 - 90})`}
        />
      ))}
      <circle r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
