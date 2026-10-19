export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bricman-mathis.fr").replace(/\/$/, "");
}

export function publicPath(locale: Locale, path = "/") {
  const [base, hash] = path.split("#");
  const normalized = !base || base === "" ? "/" : base.startsWith("/") ? base : `/${base}`;
  const prefix =
    locale === "en" ? (normalized === "/" ? "/en" : `/en${normalized}`) : normalized;
  return hash ? `${prefix}#${hash}` : prefix;
}

export function swapLocale(pathname: string, next: Locale) {
  const bare = pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
  const path = bare.startsWith("/") ? bare : `/${bare}`;
  return publicPath(next, path);
}

export function cvPdfHref(locale: Locale) {
  return `/api/cv?locale=${locale}`;
}
