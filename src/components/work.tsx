"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { projectDomain, projects, type ProjectMeta } from "@content/projects";
import type { Dictionary } from "@content/types";
import { TiltShot } from "@/components/tilt-shot";
import { ArrowUpRight, Kicker, RevealTitle } from "@/components/ui";
import { useMediaQuery } from "@/lib/hooks";
import { publicPath, type Locale } from "@/lib/locale";

function Card({
  meta,
  index,
  total,
  progress,
  dict,
  locale,
  stacked,
}: {
  meta: ProjectMeta;
  index: number;
  total: number;
  progress: MotionValue<number>;
  dict: Dictionary;
  locale: Locale;
  stacked: boolean;
}) {
  const copy = dict.cases[meta.slug];
  const from = index / total;
  // Chaque carte recule et s'assombrit à mesure que la suivante vient se poser dessus.
  const scale = useTransform(progress, [from, 1], [1, 1 - (total - index - 1) * 0.035]);
  const dim = useTransform(
    progress,
    [from, Math.min(1, from + 1 / total)],
    [0, index === total - 1 ? 0 : 0.35],
  );
  const href = publicPath(locale, `/projets/${meta.slug}`);

  return (
    <div
      className="md:sticky md:h-[min(88svh,760px)]"
      style={stacked ? { top: `calc(88px + ${index * 16}px)` } : undefined}
    >
      <motion.article
        style={stacked ? { scale } : undefined}
        className="glass relative isolate h-full origin-top overflow-hidden rounded-[36px] before:absolute before:inset-0 before:-z-10 before:bg-bg/90 md:rounded-[44px]"
      >
        <div className="grid h-full gap-6 p-3 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] md:gap-10 md:p-5">
          <div className="flex flex-col px-3 pt-4 md:px-5 md:py-6">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>{copy.client}</span>
              <span className="tabular">
                {index + 1}/{total}
              </span>
            </div>
            <h3 className="display mt-auto pt-10 text-[clamp(2.6rem,5vw,4.6rem)]">{copy.title}</h3>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">{copy.summary}</p>
            {meta.slug === "nautiloc" ? (
              <p className="mt-4 max-w-md rounded-2xl border border-line px-4 py-3 text-sm">
                <span className="font-medium">{dict.projects.pair}.</span>{" "}
                <span className="text-muted">{dict.projects.pairNote}</span>
              </p>
            ) : null}
            <ul className="mt-6 flex flex-wrap gap-1.5">
              <li className="rounded-full border border-line px-3 py-1 text-[13px] tabular">
                {meta.year}
              </li>
              {meta.stack.map((item) => (
                <li key={item} className="rounded-full bg-ink/[0.06] px-3 py-1 text-[13px]">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-2 pb-2">
              <Link
                href={href}
                transitionTypes={["nav-forward"]}
                className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-bg transition-transform duration-500 ease-fluid hover:scale-[1.04] active:scale-[0.97]"
              >
                {dict.projects.view}
                <span className="sr-only">: {copy.title}</span>
              </Link>
              <a
                href={meta.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-5 text-sm font-medium transition-colors duration-300 hover:bg-ink/[0.06]"
              >
                {dict.projects.visit}
                <ArrowUpRight />
                <span className="sr-only">: {projectDomain(meta.url)}</span>
              </a>
            </div>
          </div>
          <Link
            href={href}
            transitionTypes={["nav-forward"]}
            tabIndex={-1}
            aria-hidden
            className="self-center rounded-[26px] md:p-2"
          >
            <TiltShot
              slug={meta.slug}
              domain={projectDomain(meta.url)}
              alt=""
              sizes="(min-width: 768px) 60vw, 100vw"
            />
          </Link>
        </div>
        <motion.span
          aria-hidden
          style={stacked ? { opacity: dim } : { opacity: 0 }}
          className="pointer-events-none absolute inset-0 bg-bg"
        />
      </motion.article>
    </div>
  );
}

export function Work({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const stacked = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section
      id="projets"
      className="relative z-10 -mt-[50svh] scroll-mt-20 px-3 pt-10 pb-24 md:px-6 md:pb-40"
      aria-labelledby="projets-title"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-6 px-2 md:grid-cols-2 md:items-end md:px-4">
          <div>
            <Kicker>{dict.projects.index}</Kicker>
            <RevealTitle
              id="projets-title"
              text={dict.projects.title}
              className="display mt-4 max-w-[14ch] text-[clamp(2.4rem,5.6vw,5.2rem)]"
            />
          </div>
          <p className="max-w-md text-lg text-muted md:justify-self-end">{dict.projects.text}</p>
        </div>

        <div ref={ref} className="mt-14 grid gap-4 md:mt-20 md:gap-[18svh]">
          {projects.map((meta, index) => (
            <Card
              key={meta.slug}
              meta={meta}
              index={index}
              total={projects.length}
              progress={scrollYProgress}
              dict={dict}
              locale={locale}
              stacked={stacked}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
