"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { profile } from "@content/projects";
import type { Dictionary } from "@content/types";
import { ArrowRight } from "@/components/ui";
import { fluid } from "@/lib/motion";

type Status = "idle" | "loading" | "success" | "invalid" | "error";

/** Champ à étiquette flottante : l'étiquette remonte dès que le champ est actif ou rempli. */
function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  multiline = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const shared =
    "peer w-full rounded-2xl border border-line bg-[var(--glass)] px-4 pt-6 pb-2 text-base text-ink outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-transparent focus:border-ink/50 focus:bg-[var(--glass-strong)] focus:ring-4 focus:ring-ink/10";
  return (
    <label className="relative block">
      {multiline ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          placeholder={label}
          className={`${shared} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={label}
          className={`${shared} h-14`}
        />
      )}
      <span className="pointer-events-none absolute top-4 left-4 origin-left text-base text-muted transition-transform duration-300 ease-fluid peer-focus:-translate-y-2.5 peer-focus:scale-[0.78] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.78]">
        {label}
      </span>
    </label>
  );
}

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as { ok?: boolean; code?: string };
      if (payload.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      setStatus(payload.code === "invalid" ? "invalid" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={dict.contact.name} name="name" required autoComplete="name" />
        <Field label={dict.contact.email} name="email" type="email" required autoComplete="email" />
      </div>
      <Field label={dict.contact.company} name="company" autoComplete="organization" />
      <Field label={dict.contact.message} name="message" required multiline />
      <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="group relative mt-2 inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-transform duration-500 ease-fluid hover:scale-[1.015] active:scale-[0.98] disabled:opacity-70"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={status === "loading" ? "loading" : status === "success" ? "success" : "idle"}
            initial={{ y: 18, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -18, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: fluid }}
            className="flex items-center gap-2"
          >
            {status === "loading" ? (
              <span
                aria-hidden
                className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
            ) : null}
            {status === "loading" ? dict.contact.sending : dict.contact.submit}
            {status === "idle" || status === "invalid" || status === "error" ? (
              <ArrowRight className="transition-transform duration-500 ease-fluid group-hover:translate-x-1" />
            ) : null}
          </motion.span>
        </AnimatePresence>
      </button>
      <div role="status" className="min-h-6 text-sm">
        <AnimatePresence mode="wait">
          {status === "success" || status === "invalid" || status === "error" ? (
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: fluid }}
              className="flex items-start gap-2"
            >
              {status === "success" ? (
                <span
                  aria-hidden
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-bg"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : null}
              <span className={status === "success" ? "" : "text-muted"}>
                {status === "success" ? dict.contact.success : null}
                {status === "invalid" ? dict.contact.invalid : null}
                {status === "error" ? (
                  <>
                    {dict.contact.error}{" "}
                    <a className="text-ink underline" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                  </>
                ) : null}
              </span>
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
