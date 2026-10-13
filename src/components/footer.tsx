"use client";

import { motion } from "motion/react";
import { profile } from "@content/projects";
import type { Dictionary } from "@content/types";
import { marseilleParts, useNow } from "@/lib/hooks";
import { fluid } from "@/lib/motion";

export function Footer({ dict }: { dict: Dictionary }) {
  const now = useNow(30_000);
  const parts = now ? marseilleParts(now) : null;
  const time = parts
    ? `${String(parts.hours).padStart(2, "0")}:${String(parts.minutes).padStart(2, "0")}`
    : "--:--";
  const year = new Date().getFullYear();
  const letters = Array.from(profile.name);

  return (
    <footer className="overflow-hidden px-3 pt-10 pb-5 md:px-6">
      <div className="mx-auto max-w-[1320px]">
        <motion.p
          aria-hidden
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.035 }}
          className="display flex justify-center overflow-hidden pb-[0.06em] text-[clamp(3rem,12.6vw,13rem)] whitespace-nowrap select-none"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className="inline-block bg-linear-to-b from-ink to-ink/10 bg-clip-text text-transparent transition-transform duration-500 ease-fluid hover:-translate-y-[0.08em]"
              variants={{
                hidden: { y: "100%", opacity: 0 },
                shown: { y: "0%", opacity: 1, transition: { duration: 1.1, ease: fluid } },
              }}
            >
              {letter === " " ? " " : letter}
            </motion.span>
          ))}
        </motion.p>

        <div className="glass mt-3 grid gap-5 rounded-[28px] px-6 py-5 text-sm md:grid-cols-[1fr_auto_auto] md:items-center md:gap-8">
          <p>
            <span className="font-medium">{profile.name}</span>
            <span className="text-muted"> {dict.footer.note}</span>
          </p>
          <p className="tabular text-muted" suppressHydrationWarning>
            {dict.footer.local} {time}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted">
            <a className="transition-colors hover:text-ink" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a
              className="transition-colors hover:text-ink"
              href={profile.github}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            <a
              className="transition-colors hover:text-ink"
              href={profile.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="glass-thin inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-ink transition-transform duration-500 ease-fluid hover:-translate-y-0.5"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <path d="M8 13V3M4 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {dict.footer.top}
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          © {year} {profile.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
