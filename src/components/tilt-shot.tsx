"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { ViewTransition } from "react";
import { cn } from "@/lib/utils";

/**
 * Capture d'un site dans un cadre de navigateur en verre. Elle s'incline vers le pointeur
 * avec un reflet qui suit la lumière, et porte le nom de transition partagé avec l'étude de cas.
 */
export function TiltShot({
  slug,
  domain,
  alt,
  sizes,
  priority = false,
  tilt = true,
  className,
}: {
  slug: string;
  domain: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  tilt?: boolean;
  className?: string;
}) {
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(0);
  const glare = useMotionTemplate`radial-gradient(60% 50% at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 70%)`;

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tilt || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 8);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div
      className={cn("[perspective:1400px]", className)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        className="relative [transform-style:preserve-3d]"
      >
        <ViewTransition name={`shot-${slug}`} share="morph" default="none">
          <div className="overflow-hidden rounded-[22px] border border-line bg-[var(--glass-strong)] shadow-[0_50px_90px_-50px_rgba(0,0,0,0.6)]">
            <div className="flex h-9 items-center gap-1.5 border-b border-line px-3.5">
              <span className="size-2.5 rounded-full bg-ink/20" />
              <span className="size-2.5 rounded-full bg-ink/20" />
              <span className="size-2.5 rounded-full bg-ink/20" />
              <span className="mx-auto truncate rounded-full bg-ink/[0.06] px-3 py-0.5 text-xs text-muted">
                {domain}
              </span>
              <span className="w-[42px]" />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              <Image
                src={`/projects/${slug}.png`}
                alt={alt}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover object-top"
              />
            </div>
          </div>
        </ViewTransition>
        {tilt ? (
          <motion.span
            aria-hidden
            style={{ backgroundImage: glare }}
            className="pointer-events-none absolute inset-0 rounded-[22px] mix-blend-soft-light"
          />
        ) : null}
      </motion.div>
    </div>
  );
}
