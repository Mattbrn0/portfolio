export const projects = [
  {
    slug: "oryzons",
    year: "2025",
    url: "https://oryzons.com/",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "SEO"],
  },
  {
    slug: "boatflow",
    year: "2025",
    url: "https://app.boatflow.fr/login",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    slug: "nautiloc",
    year: "2026",
    url: "https://app.nautiloc.pro/login",
    stack: ["Next.js", "TypeScript", "Multi-marque"],
  },
  {
    slug: "nautiflow",
    year: "2026",
    url: "https://nautiflow.fr/login",
    stack: ["Next.js", "TypeScript", "Gestion documentaire"],
  },
  {
    slug: "oryzons-converter",
    year: "2025",
    url: "https://oryzons-converter.fr/",
    stack: ["Next.js", "Extraction PDF", "Export Excel"],
  },
] as const;

export type ProjectSlug = (typeof projects)[number]["slug"];
export type ProjectMeta = (typeof projects)[number];


export function projectDomain(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

export const profile = {
  name: "Mathis Bricman",
  role: "Développeur web",
  location: "Marseille",
  email: "contact@oryzons.com",
  github: "https://github.com/Mattbrn0",
  githubLabel: "github.com/Mattbrn0",
  linkedin: "https://www.linkedin.com/in/mathis-bricman-860a4a250/",
  linkedinLabel: "LinkedIn",
  siteUrl: "https://bricman-mathis.fr",
} as const;
