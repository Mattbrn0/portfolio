"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { Fragment, type ComponentProps, type ReactNode } from "react";
import { fluid } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Suit légèrement le pointeur : le bouton « attire » le curseur sans le piéger. */
function useMagnet(strength = 0.25) {
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 20, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 20, mass: 0.6 });
  return {
    style: { x, y },
    onPointerMove(event: React.PointerEvent<HTMLElement>) {
      if (event.pointerType !== "mouse") return;
      const box = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - box.left - box.width / 2) * strength);
      y.set((event.clientY - box.top - box.height / 2) * strength);
    },
    onPointerLeave() {
      x.set(0);
      y.set(0);
    },
  };
}

const variants = {
  solid: "bg-ink text-bg",
  glass: "glass text-ink",
  ghost: "text-ink hover:bg-ink/[0.06]",
} as const;

type Variant = keyof typeof variants;

const base =
  "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-[15px] font-medium whitespace-nowrap transition-[transform,background-color] duration-500 ease-fluid active:scale-[0.97]";

export function MagneticAnchor({
  variant = "solid",
  className,
  children,
  ...props
}: Omit<ComponentProps<"a">, "ref" | "style"> & { variant?: Variant; children: ReactNode }) {
  const magnet = useMagnet();
  return (
    <motion.a
      {...(props as ComponentProps<typeof motion.a>)}
      style={magnet.style}
      onPointerMove={magnet.onPointerMove}
      onPointerLeave={magnet.onPointerLeave}
      className={cn(base, variants[variant], className)}
    >
      <Sheen />
      {children}
    </motion.a>
  );
}

/** Reflet qui traverse le bouton au survol, comme une lumière sur du verre. */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-fluid group-hover:translate-x-[300%] group-hover:opacity-100"
    />
  );
}

/** Titre révélé mot à mot derrière un masque, une seule fois à l'entrée dans l'écran. */
export function RevealTitle({
  text,
  as: Tag = "h2",
  className,
  id,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-top">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "110%", rotate: 4 },
                  shown: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: fluid } },
                }}
              >
                {word}
              </motion.span>
            </span>{" "}
          </Fragment>
        ))}
      </span>
    </MotionTag>
  );
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[15px] text-muted", className)}>{children}</p>;
}
