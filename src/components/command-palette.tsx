"use client";

import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile, projects } from "@content/projects";
import type { Dictionary } from "@content/types";
import { useThemeSwitch } from "@/components/theme-switch";
import { cvPdfHref, publicPath, swapLocale, type Locale } from "@/lib/locale";
import { fluid } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EVENT = "palette:open";

export function openPalette() {
  window.dispatchEvent(new Event(EVENT));
}

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function CommandPalette({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggle } = useThemeSwitch();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActive(0);
      setOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) setOpen(false);
        else show();
      }
    };
    window.addEventListener(EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      returnFocus.current?.focus?.();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const id = window.setTimeout(() => input.current?.focus(), 30);
    return () => {
      window.clearTimeout(id);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (hash: string) => () => router.push(publicPath(locale, `/#${hash}`));
    return [
      { id: "work", group: dict.palette.sections, label: dict.nav.work, run: go("projets") },
      { id: "about", group: dict.palette.sections, label: dict.nav.about, run: go("a-propos") },
      { id: "path", group: dict.palette.sections, label: dict.nav.path, run: go("parcours") },
      { id: "contact", group: dict.palette.sections, label: dict.nav.contact, run: go("contact") },
      {
        id: "cv-page",
        group: dict.palette.sections,
        label: dict.nav.cv,
        run: () => router.push(publicPath(locale, "/cv")),
      },
      ...projects.map((project) => ({
        id: project.slug,
        group: dict.palette.projects,
        label: dict.cases[project.slug].title,
        hint: dict.cases[project.slug].client,
        run: () =>
          router.push(publicPath(locale, `/projets/${project.slug}`), {
            transitionTypes: ["nav-forward"],
          }),
      })),
      { id: "theme", group: dict.palette.actions, label: dict.palette.theme, run: () => toggle() },
      {
        id: "lang",
        group: dict.palette.actions,
        label: dict.palette.language,
        run: () => router.push(swapLocale(pathname, locale === "fr" ? "en" : "fr")),
      },
      {
        id: "copy",
        group: dict.palette.actions,
        label: dict.palette.copyEmail,
        hint: profile.email,
        run: () => {
          navigator.clipboard
            .writeText(profile.email)
            .then(() => {
              setToast(dict.palette.copied);
              window.setTimeout(() => setToast(null), 1800);
            })
            .catch(() => {
              window.location.href = `mailto:${profile.email}`;
            });
        },
      },
      {
        id: "github",
        group: dict.palette.actions,
        label: "GitHub",
        hint: profile.githubLabel,
        run: () => window.open(profile.github, "_blank", "noopener"),
      },
      {
        id: "linkedin",
        group: dict.palette.actions,
        label: "LinkedIn",
        run: () => window.open(profile.linkedin, "_blank", "noopener"),
      },
      {
        id: "cv",
        group: dict.palette.actions,
        label: dict.palette.downloadCv,
        run: () => {
          window.location.href = cvPdfHref(locale);
        },
      },
    ];
  }, [dict, locale, pathname, router, toggle]);

  const results = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return items;
    return items.filter((item) =>
      normalize(`${item.label} ${item.hint ?? ""} ${item.group}`).includes(needle),
    );
  }, [items, query]);

  function run(item: Item | undefined) {
    if (!item) return;
    setOpen(false);
    window.setTimeout(item.run, 120);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => (results.length ? (value + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => (results.length ? (value - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[active]);
    } else if (event.key === "Tab") {
      event.preventDefault();
      input.current?.focus();
    }
  }

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onKeyDown={onKeyDown}
          >
            <div
              className="absolute inset-0 bg-bg/40 backdrop-blur-md"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={dict.palette.hint}
              initial={{ opacity: 0, y: -16, scale: 0.96, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.97, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: fluid }}
              className="glass relative w-full max-w-[600px] overflow-hidden rounded-[28px]"
            >
              <div className="flex items-center gap-3 border-b border-line px-5">
                <svg
                  viewBox="0 0 16 16"
                  className="size-4 shrink-0 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden
                >
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="m10.5 10.5 3 3" strokeLinecap="round" />
                </svg>
                <input
                  ref={input}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  placeholder={dict.palette.placeholder}
                  aria-label={dict.palette.placeholder}
                  aria-controls="palette-results"
                  aria-activedescendant={
                    results[active] ? `palette-${results[active].id}` : undefined
                  }
                  role="combobox"
                  aria-expanded
                  className="h-16 w-full bg-transparent text-[17px] outline-none placeholder:text-muted focus-visible:outline-none"
                />
                <kbd className="rounded-md border border-line px-1.5 py-px font-sans text-[11px] text-muted">
                  Esc
                </kbd>
              </div>
              <ul id="palette-results" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-muted">{dict.palette.empty}</li>
                ) : null}
                {results.map((item, index) => {
                  const heading = item.group !== lastGroup ? item.group : null;
                  lastGroup = item.group;
                  return (
                    <li key={item.id} role="presentation">
                      {heading ? (
                        <p className="px-3 pt-3 pb-1.5 text-xs text-faint">{heading}</p>
                      ) : null}
                      <button
                        id={`palette-${item.id}`}
                        type="button"
                        role="option"
                        aria-selected={index === active}
                        tabIndex={-1}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(item)}
                        className={cn(
                          "relative flex h-12 w-full items-center justify-between gap-4 rounded-2xl px-3 text-left text-[15px]",
                          index === active ? "text-ink" : "text-muted",
                        )}
                      >
                        {index === active ? (
                          <motion.span
                            layoutId="palette-active"
                            className="absolute inset-0 rounded-2xl bg-ink/[0.08]"
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        ) : null}
                        <span className="relative truncate font-medium">{item.label}</span>
                        {item.hint ? (
                          <span className="relative truncate text-sm text-faint">{item.hint}</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: fluid }}
            className="glass fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium"
          >
            {toast}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </>
  );
}
