import { en } from "./en";
import { fr } from "./fr";
import type { Dictionary } from "./types";
import type { Locale } from "@/lib/locale";

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
