"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { profile } from "@content/projects";
import type { Dictionary } from "@content/types";
import { Logo } from "@/components/logo";
import { openPalette } from "@/components/command-palette";
import { useThemeSwitch } from "@/components/theme-switch";
import { useMounted } from "@/lib/hooks";
import { publicPath, swapLocale, type Locale } from "@/lib/locale";
import { fluid } from "@/lib/motion";

const subscribeNothing = () => () => {};

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const pathname = usePathname();
  const mounted = useMounted();
  const { dark, toggle } = useThemeSwitch();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const mac = useSyncExternalStore(
    subscribeNothing,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => true,
  );
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const logoRotate = useTransform(progress, [0, 1], [0, 360]);
  const other: Locale = locale === "fr" ? "en" : "fr";

  const links = [
    { href: publicPath(locale, "/#projets"), label: dict.nav.work },
    { href: publicPath(locale, "/#a-propos"), label: dict.nav.about },
    { href: publicPath(locale, "/#parcours"), label: dict.nav.path },
    { href: publicPath(locale, "/#contact"), label: dict.nav.contact },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const iconButton =
    "grid size-10 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-ink/[0.07] hover:text-ink";

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-5">
      <motion.div
        initial={{ y: -30, opacity: 0, filter: "blur(10px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: fluid, delay: 0.1 }}
        className="glass relative mx-auto flex h-14 w-full max-w-[980px] items-center justify-between gap-2 overflow-hidden rounded-full pr-2 pl-3"
      >
        <Link
          href={publicPath(locale)}
          transitionTypes={["nav-back"]}
          className="flex items-center gap-2.5 rounded-full pr-2 text-[15px] font-semibold tracking-tight"
        >
          <motion.span style={{ rotate: logoRotate }} className="grid size-8 place-items-center">
            <Logo className="size-7" />
          </motion.span>
          <span className="hidden sm:inline">{profile.name}</span>
        </Link>

        <nav
          className="hidden items-center lg:flex"
          aria-label="Navigation"
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              onFocus={() => setHovered(link.href)}
              className="relative isolate rounded-full px-3.5 py-2 text-sm text-muted transition-colors duration-300 hover:text-ink"
            >
              {hovered === link.href ? (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-ink/[0.08]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={openPalette}
            aria-label={dict.palette.hint}
            className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm text-muted transition-colors duration-300 hover:bg-ink/[0.07] hover:text-ink md:inline-flex"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" strokeLinecap="round" />
            </svg>
            <kbd
              className="rounded-md border border-line px-1.5 py-px font-sans text-[11px]"
              suppressHydrationWarning
            >
              {mac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
          <Link
            href={swapLocale(pathname, other)}
            hrefLang={other}
            aria-label={dict.nav.lang}
            className={`${iconButton} text-xs font-medium`}
          >
            {other.toUpperCase()}
          </Link>
          <button
            type="button"
            className={iconButton}
            onClick={(event) => toggle(event)}
            aria-label={dark ? dict.nav.themeToLight : dict.nav.themeToDark}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mounted && dark ? "sun" : "moon"}
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.35, ease: fluid }}
              >
                {mounted && dark ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </button>
          <Link
            href={publicPath(locale, "/cv")}
            className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-muted transition-colors duration-300 hover:bg-ink/[0.07] hover:text-ink md:inline-flex"
          >
            {dict.nav.cv}
          </Link>
          <Link
            href={publicPath(locale, "/#contact")}
            className="ml-1 hidden h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-bg transition-transform duration-300 ease-fluid hover:scale-[1.04] active:scale-[0.97] md:inline-flex"
          >
            {dict.nav.cta}
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? dict.nav.close : dict.nav.open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3 w-4">
              <motion.span
                className="absolute inset-x-0 top-0 h-[1.5px] rounded-full bg-ink"
                animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.35, ease: fluid }}
              />
              <motion.span
                className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-ink"
                animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.35, ease: fluid }}
              />
            </span>
          </button>
        </div>

        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-6 bottom-0 h-px origin-left bg-ink/40"
        />
      </motion.div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="menu-mobile"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, y: -12, scale: 0.97, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, scale: 0.97, filter: "blur(12px)" }}
            transition={{ duration: 0.45, ease: fluid }}
            className="glass mx-auto mt-2 max-w-[980px] origin-top rounded-[32px] p-3 lg:hidden"
          >
            {links.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: fluid, delay: 0.05 * index + 0.08 }}
              >
                <Link
                  href={link.href}
                  className="display flex min-h-16 items-center rounded-2xl px-4 text-4xl transition-colors hover:bg-ink/[0.06]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={publicPath(locale, "/cv")}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center justify-center rounded-2xl border border-line text-[15px] font-medium"
              >
                {dict.nav.cv}
              </Link>
              <Link
                href={publicPath(locale, "/#contact")}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center justify-center rounded-2xl bg-ink text-[15px] font-medium text-bg"
              >
                {dict.nav.cta}
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
