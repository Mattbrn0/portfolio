"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const noop = () => () => {};

/** Vrai une fois côté client : évite les écarts d'hydratation pour l'heure, le thème, WebGL. */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Date courante rafraîchie à intervalle régulier, `null` tant que le client n'est pas monté. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

const zone = "Europe/Paris";

/** Heure murale à Marseille, quelle que soit la zone du visiteur. */
export function marseilleParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "0";
  return {
    hours: Number(read("hour")),
    minutes: Number(read("minute")),
    seconds: Number(read("second")),
    weekday: read("weekday"),
  };
}

export function isWorkingHours(date: Date) {
  const { hours, weekday } = marseilleParts(date);
  return !["Sat", "Sun"].includes(weekday) && hours >= 9 && hours < 19;
}

let webglSupport: boolean | null = null;

export function supportsWebgl() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
