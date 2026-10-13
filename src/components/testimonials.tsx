"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Dictionary } from "@content/types";
import { ArrowRight, Kicker, RevealTitle } from "@/components/ui";
import { publicPath, type Locale } from "@/lib/locale";
import { fluid } from "@/lib/motion";

/**
 * Références clients. Un avis (`quote`) ne s'affiche que s'il a été donné par le client :
 * sans lui, la carte présente la référence et le produit livré.
 */
export function Testimonials({ proof, locale }: { proof: Dictionary["proof"]; locale: Locale }) {
  return (
    <section className="px-3 py-24 md:px-6 md:py-36" aria-labelledby="clients-title">
      <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end md:gap-16">
        <div className="px-2 md:px-4 md:pb-8">
          <Kicker>{proof.index}</Kicker>
          <RevealTitle
            id="clients-title"
            text={proof.title}
            className="display mt-4 max-w-[10ch] text-[clamp(2.4rem,5.4vw,5rem)]"
          />
          <p className="mt-6 max-w-sm text-lg text-muted">{proof.note}</p>
        </div>

        <div className="grid gap-4">
          {proof.items.map((item) => (
            <motion.figure
              key={item.client}
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.1, ease: fluid }}
              className="glass group overflow-hidden rounded-[36px] p-3 md:rounded-[44px] md:p-4"
            >
              <div className="relative aspect-[16/7] overflow-hidden rounded-[26px] md:rounded-[32px]">
                <Image
                  src={`/projects/${item.project}.png`}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover object-[center_30%] transition-transform duration-[1.4s] ease-fluid group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
                />
                <p className="display absolute bottom-5 left-6 text-[clamp(2.4rem,5vw,4.4rem)] text-white md:bottom-7 md:left-8">
                  {item.client}
                </p>
              </div>
              <div className="grid gap-6 px-4 pt-6 pb-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:px-5">
                <div>
                  <p className="text-sm text-muted">{item.activity}</p>
                  {item.quote ? (
                    <blockquote className="display mt-3 text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.1] tracking-[-0.03em]">
                      “{item.quote}”
                    </blockquote>
                  ) : null}
                  <figcaption
                    className={item.quote ? "mt-4 text-sm text-muted" : "mt-3 max-w-xl text-lg"}
                  >
                    {item.quote && item.author ? `${item.author}, ${item.client}` : item.text}
                  </figcaption>
                </div>
                <Link
                  href={publicPath(locale, `/projets/${item.project}`)}
                  transitionTypes={["nav-forward"]}
                  className="inline-flex h-11 items-center gap-2 justify-self-start rounded-full bg-ink px-5 text-sm font-medium text-bg transition-transform duration-500 ease-fluid hover:scale-[1.04] active:scale-[0.97]"
                >
                  {proof.view}
                  <ArrowRight />
                </Link>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
