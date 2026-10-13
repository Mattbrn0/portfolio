"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { profile } from "@content/projects";
import type { Dictionary } from "@content/types";
import { ContactForm } from "@/components/contact-form";
import { Logo } from "@/components/logo";
import { ArrowUpRight, Kicker, RevealTitle } from "@/components/ui";
import { fluid } from "@/lib/motion";

export function CopyEmail({ copy, copied }: { copy: string; copied: string }) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setDone(true);
      window.setTimeout(() => setDone(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="glass-thin group inline-flex h-10 items-center gap-2 overflow-hidden rounded-full px-4 text-sm transition-transform duration-500 ease-fluid hover:scale-[1.04]"
    >
      <svg
        viewBox="0 0 16 16"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden
      >
        {done ? (
          <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="5" y="5" width="8" height="8" rx="2" />
            <path d="M3 10V4a1 1 0 0 1 1-1h6" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span className="relative grid">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={done ? "done" : "idle"}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.3, ease: fluid }}
            aria-live="polite"
          >
            {done ? copied : copy}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

export function Contact({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="contact"
      className="scroll-mt-20 px-3 py-24 md:px-6 md:py-36"
      aria-labelledby="contact-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.1, ease: fluid }}
        className="glass relative mx-auto max-w-[1320px] overflow-hidden rounded-[40px] p-6 md:rounded-[52px] md:p-14"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-40 size-[560px] text-ink opacity-[0.07]"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, ease: "linear", repeat: Infinity }}
        >
          <Logo className="size-full" />
        </motion.div>
        <div className="relative grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
          <div className="flex flex-col">
            <Kicker>{dict.contact.index}</Kicker>
            <RevealTitle
              id="contact-title"
              text={dict.contact.title}
              className="display mt-4 max-w-[10ch] text-[clamp(2.6rem,6vw,5.6rem)]"
            />
            <p className="mt-6 max-w-md text-lg text-muted">{dict.contact.text}</p>
            <div className="mt-auto pt-10">
              <a
                className="display inline-block text-[clamp(1.4rem,2.6vw,2.2rem)] underline decoration-ink/25 decoration-2 underline-offset-[8px] transition-[text-decoration-color] duration-300 hover:decoration-ink"
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
              <div className="mt-5 flex flex-wrap gap-2">
                <CopyEmail copy={dict.contact.copy} copied={dict.contact.copied} />
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-thin inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm transition-transform duration-500 ease-fluid hover:scale-[1.04]"
                >
                  GitHub <ArrowUpRight />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-thin inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm transition-transform duration-500 ease-fluid hover:scale-[1.04]"
                >
                  LinkedIn <ArrowUpRight />
                </a>
              </div>
            </div>
          </div>
          <ContactForm dict={dict} />
        </div>
      </motion.div>
    </section>
  );
}
