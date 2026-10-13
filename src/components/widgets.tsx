"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@content/types";
import { isWorkingHours, marseilleParts, useNow } from "@/lib/hooks";
import { fluid } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Cadran de Marseille : ses 30 index reprennent les 30 lames du logo. */
export function ClockWidget({ dict }: { dict: Dictionary }) {
  const now = useNow(1000);
  const parts = now ? marseilleParts(now) : null;
  const open = now ? isWorkingHours(now) : true;
  const hourAngle = parts ? ((parts.hours % 12) + parts.minutes / 60) * 30 : 0;
  const minuteAngle = parts ? (parts.minutes + parts.seconds / 60) * 6 : 0;
  const secondAngle = parts ? parts.seconds * 6 : 0;
  const time = parts
    ? `${String(parts.hours).padStart(2, "0")}:${String(parts.minutes).padStart(2, "0")}`
    : "--:--";

  return (
    <div className="flex h-full items-center gap-6">
      <svg viewBox="-50 -50 100 100" className="size-32 shrink-0 md:size-36" aria-hidden>
        <circle r="48" fill="none" stroke="var(--line)" />
        {Array.from({ length: 30 }, (_, index) => {
          const major = index % 5 === 0;
          return (
            <polygon
              key={index}
              points={
                major ? "-1.4,-46 1.4,-46 0.9,-37 -0.9,-37" : "-0.7,-46 0.7,-46 0.4,-41 -0.4,-41"
              }
              fill="currentColor"
              opacity={major ? 0.9 : 0.35}
              transform={`rotate(${index * 12})`}
            />
          );
        })}
        <g style={{ opacity: parts ? 1 : 0, transition: "opacity 600ms" }}>
          <line
            y1="6"
            y2="-24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${hourAngle})`}
          />
          <line
            y1="8"
            y2="-34"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle})`}
          />
          <g transform={`rotate(${secondAngle})`}>
            <line y1="10" y2="-38" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
            <circle cy="-38" r="1.6" fill="currentColor" />
          </g>
          <circle r="2.6" fill="var(--bg)" stroke="currentColor" strokeWidth="1.4" />
        </g>
      </svg>
      <div className="min-w-0">
        <p className="text-sm text-muted">{dict.widgets.clock}</p>
        <p className="display tabular mt-2 text-5xl md:text-6xl" suppressHydrationWarning>
          {time}
        </p>
        <p className="mt-3 flex items-start gap-2 text-sm">
          <span
            className={cn(
              "mt-1.5 size-2 shrink-0 rounded-full",
              open ? "bg-ink" : "border border-ink",
            )}
          />
          <span className="text-muted">{open ? dict.widgets.open : dict.widgets.closed}</span>
        </p>
      </div>
    </div>
  );
}

export function RadarWidget({ dict }: { dict: Dictionary }) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 size-48">
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            className="radar-ring absolute inset-0 rounded-full border border-ink/30"
            style={{ animationDelay: `${ring * 1.2}s` }}
          />
        ))}
        <span className="absolute inset-[22%] rounded-full border border-line" />
        <span className="absolute inset-[44%] rounded-full border border-line" />
        <span className="radar-sweep absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,var(--halo-a)_360deg)]" />
        <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_6px_var(--line)]" />
      </div>
      <p className="relative text-sm text-muted">{dict.widgets.location}</p>
      <div className="relative mt-16">
        <p className="display text-4xl">Marseille</p>
        <p className="tabular mt-2 text-sm text-muted">{dict.widgets.coords}</p>
      </div>
    </div>
  );
}

export function ResponseWidget({ dict }: { dict: Dictionary }) {
  const radius = 28;
  const length = 2 * Math.PI * radius;
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="text-sm text-muted">{dict.widgets.response}</p>
      <div className="mt-6 flex items-center gap-3">
        <svg viewBox="0 0 64 64" className="size-12 shrink-0 -rotate-90 xl:size-16" aria-hidden>
          <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--line)" strokeWidth="4" />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={length}
            initial={{ strokeDashoffset: length }}
            whileInView={{ strokeDashoffset: length * 0.08 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.8, ease: fluid, delay: 0.2 }}
          />
        </svg>
        <p className="display text-4xl whitespace-nowrap xl:text-5xl">
          {dict.widgets.responseValue}
        </p>
      </div>
      <p className="mt-4 text-sm text-muted">{dict.widgets.responseText}</p>
    </div>
  );
}

/** Trois anneaux en rotation lente : interface au centre, données autour, tenue à l'extérieur. */
export function StackOrbit({ dict }: { dict: Dictionary }) {
  const rings = dict.skills.groups.map((group, index) => ({
    ...group,
    radius: 18 + index * 14,
    speed: `${46 + index * 18}s`,
    reverse: index % 2 === 1,
  }));

  return (
    <div className="grid h-full gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
      <div>
        <p className="text-sm text-muted">{dict.skills.index}</p>
        <h3 className="display mt-3 text-[clamp(2rem,3.4vw,3rem)]">{dict.skills.title}</h3>
        <p className="mt-3 max-w-sm text-muted">{dict.skills.text}</p>
        <ul className="mt-6 grid gap-2 text-sm">
          {rings.map((ring, index) => (
            <li key={ring.title} className="flex items-center gap-3">
              <span className="tabular grid size-6 place-items-center rounded-full border border-line text-xs text-muted">
                {index + 1}
              </span>
              <span className="font-medium">{ring.title}</span>
              <span className="truncate text-muted">{ring.items.join(", ")}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-faint">{dict.widgets.stackHint}</p>
      </div>
      <div className="relative mx-auto aspect-square w-full max-w-[400px]" aria-hidden>
        {rings.map((ring) => (
          <div
            key={ring.title}
            className="orbit absolute top-1/2 left-1/2 rounded-full border border-line"
            style={
              {
                width: `${ring.radius * 2}%`,
                height: `${ring.radius * 2}%`,
                marginLeft: `-${ring.radius}%`,
                marginTop: `-${ring.radius}%`,
                "--speed": ring.speed,
                animationDirection: ring.reverse ? "reverse" : "normal",
              } as React.CSSProperties
            }
          >
            {ring.items.map((item, position) => {
              const angle = (position / ring.items.length) * Math.PI * 2 + ring.radius;
              return (
                <span
                  key={item}
                  className="orbit-label glass-thin absolute rounded-full px-3 py-1 text-[12.5px] whitespace-nowrap"
                  style={
                    {
                      left: `${(50 + Math.cos(angle) * 50).toFixed(3)}%`,
                      top: `${(50 + Math.sin(angle) * 50).toFixed(3)}%`,
                      transform: "translate(-50%, -50%)",
                      "--speed": ring.speed,
                      animationDirection: ring.reverse ? "reverse" : "normal",
                    } as React.CSSProperties
                  }
                >
                  {item}
                </span>
              );
            })}
          </div>
        ))}
        <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
      </div>
    </div>
  );
}
