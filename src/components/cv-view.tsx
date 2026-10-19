"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@content/projects";
import type { Dictionary } from "@content/types";
import { Logo } from "@/components/logo";
import { ArrowRight, ArrowUpRight, MagneticAnchor } from "@/components/ui";
import { cvPdfHref, publicPath, type Locale } from "@/lib/locale";
import { fluid } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Cv = Dictionary["cv"];

const sections = ["experience", "projets", "formation", "competences"] as const;
type SectionId = (typeof sections)[number];

function telHref(phone: string) {
  return `tel:+33${phone.replace(/\s/g, "").slice(1)}`;
}

function bare(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

/* Apparition commune : monte, se défloute, une seule fois. */
const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: fluid } },
};

const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Écrit la position du pointeur dans --mx / --my pour le halo `.spotlight`. */
function trackSpot(event: React.PointerEvent<HTMLElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
}

/** Nom révélé lettre par lettre, chaque mot derrière son masque. */
function SplitName({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      className="display text-[clamp(3.5rem,12vw,9.75rem)] leading-[0.86]"
      initial="hidden"
      animate="shown"
      variants={stagger(0.035, 0.15)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className="block">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="block overflow-hidden pb-[0.08em]">
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={`${letter}-${letterIndex}`}
                className="inline-block"
                variants={{
                  hidden: { y: "105%", rotate: 6 },
                  shown: { y: "0%", rotate: 0, transition: { duration: 1, ease: fluid } },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        ))}
      </span>
    </motion.h1>
  );
}

/** Nombre qui compte jusqu'à sa valeur quand il entre dans l'écran. */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: fluid,
      onUpdate: (latest) => setShown(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular">
      {String(reduce ? value : shown).padStart(2, "0")}
    </span>
  );
}

function CopyButton({ value, idle, done }: { value: string; idle: string; done: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? done : idle}
      title={copied ? done : idle}
      className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-ink/[0.06] hover:text-ink"
    >
      <motion.svg
        key={copied ? "done" : "idle"}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: fluid }}
        viewBox="0 0 16 16"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {copied ? (
          <path d="m3.5 8.5 3 3 6-7" />
        ) : (
          <>
            <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
            <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
          </>
        )}
      </motion.svg>
    </button>
  );
}

/** Carte de visite : le logo en vague, les coordonnées, une copie d'email. */
function IdCard({ cv, dict }: { cv: Cv; dict: Dictionary }) {
  const site = bare(profile.siteUrl);
  const rows = [
    { href: `mailto:${cv.email}`, label: cv.email, external: false, copy: true },
    { href: telHref(cv.phone), label: cv.phone, external: false, copy: false },
    { href: profile.siteUrl, label: site, external: true, copy: false },
    { href: profile.github, label: profile.githubLabel, external: true, copy: false },
    { href: profile.linkedin, label: profile.linkedinLabel, external: true, copy: false },
  ];

  return (
    <motion.aside
      variants={rise}
      onPointerMove={trackSpot}
      className="glass spotlight rounded-[32px] p-6 md:rounded-[36px] md:p-7"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-muted">{cv.address}</p>
          <p className="mt-1 text-sm text-muted">{cv.license}</p>
        </div>
        <Logo animated className="size-12 shrink-0" />
      </div>
      <motion.ul className="mt-6 grid" variants={stagger(0.06, 0.5)}>
        {rows.map((row) => (
          <motion.li
            key={row.href}
            variants={{
              hidden: { opacity: 0, x: 14 },
              shown: { opacity: 1, x: 0, transition: { duration: 0.7, ease: fluid } },
            }}
            className="flex items-center gap-2 border-t border-line first:border-t-0"
          >
            <a
              href={row.href}
              {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group flex min-h-12 flex-1 items-center justify-between gap-3 text-[15px]"
            >
              <span className="truncate">{row.label}</span>
              <ArrowUpRight className="size-3.5 shrink-0 text-muted transition-transform duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
            </a>
            {row.copy ? (
              <CopyButton value={cv.email} idle={dict.contact.copy} done={dict.contact.copied} />
            ) : null}
          </motion.li>
        ))}
      </motion.ul>
    </motion.aside>
  );
}

function SectionTitle({ id, index, title }: { id: SectionId; index: number; title: string }) {
  return (
    <motion.div
      className="flex items-end gap-4"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.8 }}
      variants={stagger(0.08)}
    >
      <motion.span variants={rise} className="tabular pb-2 text-sm text-muted">
        {String(index).padStart(2, "0")}
      </motion.span>
      <span className="block overflow-hidden pb-[0.1em]">
        <motion.h2
          id={`${id}-title`}
          className="display text-[clamp(2.4rem,6vw,5.25rem)]"
          variants={{
            hidden: { y: "105%" },
            shown: { y: "0%", transition: { duration: 1, ease: fluid } },
          }}
        >
          {title}
        </motion.h2>
      </span>
      <motion.span
        aria-hidden
        className="mb-4 hidden h-px flex-1 origin-left bg-line sm:block"
        variants={{
          hidden: { scaleX: 0 },
          shown: { scaleX: 1, transition: { duration: 1.2, ease: fluid } },
        }}
      />
    </motion.div>
  );
}

/** Sommaire collant : suit la section lue, une pastille glisse de l'une à l'autre. */
function Rail({ cv, labels, active }: { cv: Cv; labels: string[]; active: SectionId }) {
  return (
    <nav aria-label={cv.onPage} className="sticky top-32 hidden self-start lg:block">
      <p className="px-4 text-sm text-muted">{cv.onPage}</p>
      <ul className="mt-3 grid gap-1">
        {sections.map((id, index) => {
          const current = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-full px-4 text-[15px] transition-colors duration-500",
                  current ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {current ? (
                  <motion.span
                    layoutId="cv-rail"
                    className="glass absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                ) : null}
                <span className="tabular relative text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative">{labels[index]}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Experience({ cv }: { cv: Cv }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [reached, setReached] = useState(-1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const count = cv.experience.length;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    // Un point s'allume quand la ligne l'atteint.
    setReached(value < 0.02 ? -1 : Math.min(count - 1, Math.floor(value * (count - 1) + 0.5)));
  });

  return (
    <ol ref={ref} className="relative mt-10 grid gap-4 pl-10 md:mt-14 md:pl-14">
      <span
        aria-hidden
        className="absolute top-3 bottom-3 left-[11px] w-px bg-line md:left-[15px]"
      />
      <motion.span
        aria-hidden
        style={{ scaleY: reduce ? 1 : line }}
        className="absolute top-3 bottom-3 left-[11px] w-px origin-top bg-ink md:left-[15px]"
      />
      {cv.experience.map((job, index) => {
        const lit = reduce || index <= reached;
        return (
          <motion.li
            key={`${job.title}-${job.period}`}
            className="relative"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger(0.06)}
          >
            <span
              aria-hidden
              className={cn(
                "absolute top-8 -left-10 grid size-6 place-items-center rounded-full border transition-[background-color,border-color,transform] duration-500 ease-fluid md:-left-14 md:size-8",
                lit ? "scale-100 border-ink bg-ink" : "scale-75 border-line bg-bg",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-500 md:size-2",
                  lit ? "bg-bg" : "bg-faint",
                )}
              />
            </span>
            <motion.article
              variants={rise}
              onPointerMove={trackSpot}
              className="glass spotlight grid gap-4 rounded-[28px] p-6 md:grid-cols-[170px_minmax(0,1fr)] md:gap-8 md:rounded-[32px] md:p-8"
            >
              <motion.p
                variants={rise}
                className="tabular text-sm whitespace-nowrap text-muted md:pt-2"
              >
                {job.period}
              </motion.p>
              <div>
                <motion.h3
                  variants={rise}
                  className="text-2xl font-semibold tracking-tight md:text-[1.9rem] md:leading-tight"
                >
                  {job.title}
                </motion.h3>
                <motion.p variants={rise} className="mt-1 text-muted">
                  {job.org}
                </motion.p>
                <ul className="mt-5 grid gap-2.5 text-[15px] leading-relaxed md:text-base">
                  {job.bullets.map((bullet) => (
                    <motion.li
                      key={bullet}
                      variants={rise}
                      className="grid grid-cols-[1.25rem_1fr] gap-1"
                    >
                      <span aria-hidden className="mt-[0.7em] h-px w-3 bg-faint" />
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </motion.li>
        );
      })}
    </ol>
  );
}

function Projects({ cv }: { cv: Cv }) {
  return (
    <motion.ul
      className="mt-10 border-t border-line md:mt-14"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger(0.09)}
    >
      {cv.selected.map((item, index) => (
        <motion.li key={item.name} variants={rise} className="border-b border-line">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group relative grid gap-2 overflow-hidden px-2 py-7 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)_48px] md:items-center md:gap-8 md:px-4 md:py-9"
          >
            {/* Le fond monte depuis le bas au survol, comme une page qu'on soulève. */}
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 bg-ink/[0.04] transition-transform duration-700 ease-fluid group-hover:scale-y-100"
            />
            <span className="tabular relative text-sm text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="relative">
              <span className="display block text-[clamp(1.9rem,3.6vw,3.1rem)] transition-transform duration-700 ease-fluid group-hover:translate-x-2">
                {item.name}
              </span>
              <span className="mt-2 block text-sm text-muted">{bare(item.url)}</span>
            </span>
            <span className="relative text-muted md:text-lg">{item.text}</span>
            <span className="relative hidden size-12 place-items-center rounded-full border border-line transition-[background-color,color,border-color,transform] duration-500 ease-fluid group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-bg md:grid">
              <ArrowRight className="-rotate-45" />
            </span>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function Education({ cv }: { cv: Cv }) {
  return (
    <motion.ol
      className="mt-10 grid gap-3 md:mt-14 md:grid-cols-3"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger(0.1)}
    >
      {cv.education.map((item, index) => (
        <motion.li
          key={item.title}
          variants={rise}
          onPointerMove={trackSpot}
          className="glass spotlight flex flex-col justify-between md:min-h-56 rounded-[28px] p-6 md:rounded-[32px] md:p-7"
        >
          <div className="flex items-center justify-between text-sm text-muted">
            <span className="tabular">{item.period}</span>
            <span className="tabular">{String(cv.education.length - index).padStart(2, "0")}</span>
          </div>
          <div className="mt-6 md:mt-10">
            <h3 className="text-xl leading-snug font-semibold tracking-tight md:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 text-muted">{item.school}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 12, scale: 0.92 },
        shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: fluid } },
      }}
      whileHover={{ y: -3 }}
      className="glass-thin rounded-full px-4 py-2 text-[15px]"
    >
      {children}
    </motion.li>
  );
}

function Toolkit({ cv }: { cv: Cv }) {
  return (
    <motion.div
      className="mt-10 grid gap-3 md:mt-14 md:grid-cols-6"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
      variants={stagger(0.1)}
    >
      <motion.section
        variants={rise}
        onPointerMove={trackSpot}
        aria-label={cv.stackTitle}
        className="glass spotlight rounded-[28px] p-6 md:col-span-4 md:rounded-[32px] md:p-8"
      >
        <h3 className="text-sm text-muted">{cv.stackTitle}</h3>
        <motion.ul className="mt-5 flex flex-wrap gap-2" variants={stagger(0.04, 0.2)}>
          {cv.stack.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </motion.ul>
      </motion.section>

      <motion.section
        variants={rise}
        onPointerMove={trackSpot}
        aria-label={cv.languagesTitle}
        className="glass spotlight rounded-[28px] p-6 md:col-span-2 md:rounded-[32px] md:p-8"
      >
        <h3 className="text-sm text-muted">{cv.languagesTitle}</h3>
        <ul className="mt-5 grid gap-4">
          {cv.languages.map((item) => {
            const [name, level] = item.split(" — ");
            return (
              <li key={item}>
                <p className="display text-3xl">{name}</p>
                {level ? <p className="mt-1 text-sm text-muted">{level}</p> : null}
              </li>
            );
          })}
        </ul>
      </motion.section>

      <motion.section
        variants={rise}
        onPointerMove={trackSpot}
        aria-label={cv.skillsTitle}
        className="glass spotlight rounded-[28px] p-6 md:col-span-6 md:rounded-[32px] md:p-8"
      >
        <h3 className="text-sm text-muted">{cv.skillsTitle}</h3>
        <motion.ul className="mt-5 flex flex-wrap gap-2" variants={stagger(0.05, 0.2)}>
          {cv.skills.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </motion.ul>
      </motion.section>
    </motion.div>
  );
}

/** Aperçu de la page A4 : s'incline vers le pointeur, avec un reflet. */
function PaperPreview({ cv }: { cv: Cv }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });
  const gx = useMotionValue(30);
  const glare = useTransform(
    gx,
    (value) =>
      `linear-gradient(115deg, transparent ${value - 25}%, rgba(255,255,255,0.55) ${value}%, transparent ${value + 25}%)`,
  );

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    ry.set((px - 0.5) * 16);
    rx.set((0.5 - py) * 12);
    gx.set(px * 100);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const bar = "h-[3px] rounded-full bg-black/12";

  return (
    <div
      className="flex justify-center [perspective:1200px]"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        className="relative aspect-[210/297] w-[min(100%,300px)] rotate-[-3deg] overflow-hidden rounded-[10px] bg-white p-[8%] text-black shadow-[0_60px_100px_-50px_rgba(0,0,0,0.75)] ring-1 ring-black/10 [transform-style:preserve-3d]"
      >
        <div aria-hidden className="flex h-full flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[6px] tracking-[0.18em] text-black/50 uppercase">{cv.role}</p>
              <p className="display mt-1 text-[22px] leading-none">{profile.name}</p>
            </div>
            <Logo className="size-6 text-black" />
          </div>
          <div className="mt-3 grid gap-1">
            <span className={cn(bar, "w-[90%]")} />
            <span className={cn(bar, "w-[75%]")} />
          </div>
          <div className="mt-3 h-[10px] border-y border-black" />
          <div className="mt-3 grid flex-1 grid-cols-[1fr_34%] gap-3">
            <div className="grid content-start gap-1.5">
              <span className="h-[5px] w-1/3 rounded-full bg-black/80" />
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className="mt-1 grid gap-1 border-l border-black/15 pl-2">
                  <span className="h-[3px] w-1/2 rounded-full bg-black/60" />
                  <span className={cn(bar, "w-[85%]")} />
                  <span className={cn(bar, "w-[65%]")} />
                </div>
              ))}
              <span className="mt-2 h-[5px] w-2/5 rounded-full bg-black/80" />
              <div className="mt-1 grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <div key={n} className="grid gap-1 border-t border-black pt-1">
                    <span className="h-[3px] w-2/3 rounded-full bg-black/60" />
                    <span className={cn(bar, "w-full")} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid content-start gap-2 rounded-[5px] bg-black/[0.05] p-2">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className="grid gap-1">
                  <span className="h-[3px] w-1/2 rounded-full bg-black/40" />
                  <div className="flex flex-wrap gap-0.5">
                    {[0, 1, 2].map((m) => (
                      <span
                        key={m}
                        className="h-[6px] w-[30%] rounded-full border border-black/15 bg-white"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <motion.span
          aria-hidden
          style={{ backgroundImage: glare }}
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        />
      </motion.div>
    </div>
  );
}

export function CvView({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const cv = dict.cv;
  const [active, setActive] = useState<SectionId>("experience");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const labels = [cv.experienceTitle, cv.projectsTitle, cv.educationTitle, cv.toolkitTitle];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const figures = [
    { value: cv.experience.length, label: cv.experienceTitle },
    { value: cv.selected.length, label: cv.projectsTitle },
    { value: cv.stack.length, label: cv.stackTitle },
  ];

  return (
    <div className="px-3 pt-28 pb-16 md:px-6 md:pt-36">
      <motion.span
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ink"
      />

      <div className="mx-auto max-w-[1320px]">
        <motion.div
          className="flex flex-wrap items-center justify-between gap-3 px-2 md:px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: fluid }}
        >
          <MagneticAnchor href={publicPath(locale)} variant="glass" className="h-10 px-4 text-sm">
            <ArrowRight className="rotate-180 transition-transform duration-500 ease-fluid group-hover:-translate-x-0.5" />
            {cv.back}
          </MagneticAnchor>
          <MagneticAnchor href={cvPdfHref(locale)} download className="h-10 px-5 text-sm">
            {cv.download}
            <ArrowUpRight className="transition-transform duration-500 ease-fluid group-hover:translate-y-0.5 group-hover:rotate-[135deg]" />
          </MagneticAnchor>
        </motion.div>

        <motion.header
          className="mt-14 grid gap-10 px-2 md:mt-20 md:px-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)] lg:items-end"
          initial="hidden"
          animate="shown"
          variants={stagger(0.12, 0.1)}
        >
          <div>
            <motion.p
              variants={rise}
              className="glass-thin inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm"
            >
              <span className="relative grid size-2 place-items-center">
                <span className="pulse-dot absolute inset-0 rounded-full bg-ink" />
                <span className="relative size-2 rounded-full bg-ink" />
              </span>
              {cv.role} · {dict.hero.available}
            </motion.p>
            <div className="mt-6">
              <SplitName text={profile.name} />
            </div>
            <motion.p
              variants={rise}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
            >
              {cv.profile}
            </motion.p>
          </div>
          <IdCard cv={cv} dict={dict} />
        </motion.header>

        <motion.dl
          className="mt-14 grid grid-cols-3 gap-3 px-2 md:mt-20 md:px-4"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.6 }}
          variants={stagger(0.1)}
        >
          {figures.map((item) => (
            <motion.div
              key={item.label}
              variants={rise}
              className="flex flex-col-reverse gap-2 border-t border-line pt-5"
            >
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="display text-[clamp(2.6rem,7vw,5.5rem)]">
                <Counter value={item.value} />
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <div className="mt-20 grid gap-12 px-2 md:mt-28 md:px-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <Rail cv={cv} labels={labels} active={active} />

          <div className="grid min-w-0 gap-24 md:gap-32">
            <section id="experience" className="scroll-mt-28" aria-labelledby="experience-title">
              <SectionTitle id="experience" index={1} title={cv.experienceTitle} />
              <Experience cv={cv} />
            </section>

            <section id="projets" className="scroll-mt-28" aria-labelledby="projets-title">
              <SectionTitle id="projets" index={2} title={cv.projectsTitle} />
              <Projects cv={cv} />
            </section>

            <section id="formation" className="scroll-mt-28" aria-labelledby="formation-title">
              <SectionTitle id="formation" index={3} title={cv.educationTitle} />
              <Education cv={cv} />
            </section>

            <section id="competences" className="scroll-mt-28" aria-labelledby="competences-title">
              <SectionTitle id="competences" index={4} title={cv.toolkitTitle} />
              <Toolkit cv={cv} />
            </section>
          </div>
        </div>

        <motion.section
          className="glass spotlight mt-24 grid items-center gap-12 overflow-hidden rounded-[36px] p-7 md:mt-32 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:rounded-[44px] md:p-14"
          onPointerMove={trackSpot}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger(0.12)}
        >
          <div>
            <motion.h2 variants={rise} className="display text-[clamp(2.6rem,6vw,5.5rem)]">
              {cv.pdfTitle}
            </motion.h2>
            <motion.p variants={rise} className="mt-6 max-w-md text-lg text-muted">
              {cv.pdfText}
            </motion.p>
            <motion.div variants={rise} className="mt-10">
              <MagneticAnchor href={cvPdfHref(locale)} download>
                {cv.download}
                <ArrowUpRight className="transition-transform duration-500 ease-fluid group-hover:translate-y-0.5 group-hover:rotate-[135deg]" />
              </MagneticAnchor>
            </motion.div>
          </div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 60, rotate: 6 },
              shown: { opacity: 1, y: 0, rotate: 0, transition: { duration: 1.2, ease: fluid } },
            }}
          >
            <PaperPreview cv={cv} />
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
