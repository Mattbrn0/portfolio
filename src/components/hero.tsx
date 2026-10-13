"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore } from "react";
import type { Dictionary } from "@content/types";
import { Logo } from "@/components/logo";
import { ArrowRight, MagneticAnchor } from "@/components/ui";
import { supportsWebgl, useMediaQuery, useMounted } from "@/lib/hooks";
import { publicPath, type Locale } from "@/lib/locale";
import { fluid } from "@/lib/motion";

const ApertureScene = dynamic(
  () => import("@/components/aperture-scene").then((mod) => mod.ApertureScene),
  {
    ssr: false,
  },
);

const conditions = ["(prefers-reduced-motion: reduce)", "(max-width: 767px)"];

function subscribeWebgl(onChange: () => void) {
  const queries = conditions.map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onChange));
}

function readWebgl() {
  return conditions.every((query) => !window.matchMedia(query).matches) && supportsWebgl();
}

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const webgl = useSyncExternalStore(subscribeWebgl, readWebgl, () => false);
  const wide = useMediaQuery("(min-width: 1024px)");
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  const copyOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  const copyBlur = useTransform(progress, [0, 0.3], ["blur(0px)", "blur(14px)"]);
  const copyY = useTransform(progress, [0, 0.3], [0, -90]);
  const stageOpacity = useTransform(progress, [0.82, 1], [1, 0]);
  const fallbackScale = useTransform(progress, [0, 1], [1, 7]);
  const fallbackRotate = useTransform(progress, [0, 1], [0, 140]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  const words = dict.hero.title.split(" ");
  const dark = !mounted || resolvedTheme !== "light";

  return (
    <section ref={ref} className="relative h-[220svh]" aria-labelledby="hero-title">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ opacity: stageOpacity }}>
          <p className="sr-only">{dict.hero.scene}</p>
          {webgl ? (
            <ApertureScene
              color={dark ? "#f2f2f2" : "#151515"}
              progress={progress}
              offsetX={wide ? 0.95 : 0.55}
            />
          ) : (
            <div className="grid h-full place-items-start justify-items-end pt-[14svh] opacity-30 md:place-items-center md:pt-0 md:pr-[8vw] md:opacity-100">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.6, ease: fluid }}
              >
                <motion.div style={{ scale: fallbackScale, rotate: fallbackRotate }}>
                  <Logo animated className="size-[62vw] max-w-[420px] text-ink md:size-[34vw]" />
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>

        <motion.div
          className="relative flex h-full flex-col justify-end px-5 pt-28 pb-10 md:px-10 md:pb-14"
          style={{ opacity: copyOpacity, filter: copyBlur, y: copyY }}
        >
          <div className="mx-auto w-full max-w-[1320px]">
            <motion.p
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: fluid, delay: 0.2 }}
              className="glass-thin inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 text-sm"
            >
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-ink/50" />
                <span className="relative size-2 rounded-full bg-ink" />
              </span>
              <span className="font-medium">{dict.hero.available}</span>
              <span className="text-muted">{dict.hero.eyebrow}</span>
            </motion.p>

            <h1
              id="hero-title"
              className="display mt-6 max-w-[11ch] text-[clamp(3rem,min(9vw,12svh),9.5rem)]"
              aria-label={dict.hero.title}
            >
              {words.map((word, index) => (
                <span key={`${word}-${index}`} aria-hidden>
                  <span className="inline-block overflow-hidden pb-[0.1em] align-top">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "105%", rotate: 5 }}
                      animate={{ y: "0%", rotate: 0 }}
                      transition={{ duration: 1.1, ease: fluid, delay: 0.35 + index * 0.07 }}
                    >
                      {word}
                    </motion.span>
                  </span>{" "}
                </span>
              ))}
            </h1>

            <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: fluid, delay: 0.9 }}
                className="max-w-md"
              >
                <p className="text-lg leading-relaxed text-muted md:text-xl">{dict.hero.text}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <MagneticAnchor href={publicPath(locale, "/#contact")}>
                    {dict.hero.primary}
                    <ArrowRight className="transition-transform duration-500 ease-fluid group-hover:translate-x-0.5" />
                  </MagneticAnchor>
                  <MagneticAnchor href={publicPath(locale, "/#projets")} variant="glass">
                    {dict.hero.secondary}
                  </MagneticAnchor>
                </div>
              </motion.div>

              <dl className="hidden grid-cols-3 gap-2 sm:grid md:w-[440px]">
                {dict.hero.proofs.map((item, index) => (
                  <motion.div
                    key={item.v}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, ease: fluid, delay: 1.05 + index * 0.08 }}
                    className="glass rounded-2xl p-3.5 md:p-4"
                  >
                    <dt className="display text-2xl md:text-3xl">{item.k}</dt>
                    <dd className="mt-1.5 text-[12.5px] leading-snug text-muted md:text-[13px]">
                      {item.v}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute top-28 right-5 hidden items-center gap-3 text-sm text-muted md:right-10 md:flex"
        >
          {dict.hero.scroll}
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-ink"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
