"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import type { Dictionary } from "@content/types";
import { Kicker, RevealTitle } from "@/components/ui";
import { fluid } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Journey({ journey }: { journey: Dictionary["journey"] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(-1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const count = journey.steps.length;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    // Une étape s'allume quand la ligne l'atteint.
    setReached(value < 0.02 ? -1 : Math.min(count - 1, Math.floor(value * (count - 1) + 0.5)));
  });

  return (
    <section
      id="parcours"
      className="scroll-mt-20 px-5 py-24 md:px-10 md:py-36"
      aria-labelledby="parcours-title"
    >
      <div className="mx-auto grid max-w-[1320px] gap-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="md:sticky md:top-32 md:self-start">
          <Kicker>{journey.index}</Kicker>
          <RevealTitle
            id="parcours-title"
            text={journey.title}
            className="display mt-4 max-w-[12ch] text-[clamp(2.4rem,5.4vw,5rem)]"
          />
          <p className="mt-6 max-w-md text-lg text-muted">{journey.text}</p>
        </div>

        <ol ref={ref} className="relative grid gap-16 pl-14 md:gap-24 md:pl-20">
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[15px] w-px bg-line md:left-[19px]"
          />
          <motion.span
            aria-hidden
            style={{ scaleY: line }}
            className="absolute top-2 bottom-2 left-[15px] w-px origin-top bg-ink md:left-[19px]"
          />
          {journey.steps.map((step, index) => {
            const active = index <= reached;
            return (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className={cn(
                    "tabular absolute top-0 -left-14 grid size-8 place-items-center rounded-full border text-sm font-medium transition-colors duration-500 md:-left-20 md:size-10",
                    active ? "border-ink bg-ink text-bg" : "border-line bg-bg text-muted",
                  )}
                >
                  {index + 1}
                </span>
                <motion.div
                  initial={{ opacity: 0.25 }}
                  animate={{ opacity: active ? 1 : 0.25 }}
                  transition={{ duration: 0.6, ease: fluid }}
                >
                  <p className="text-sm text-muted">{step.period}</p>
                  <h3 className="display mt-3 text-[clamp(1.9rem,3.4vw,3rem)]">{step.title}</h3>
                  <p className="mt-3 max-w-md text-lg text-muted">{step.text}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
