import type { ProjectSlug } from "./projects";

export type ProjectCopy = {
  title: string;
  client: string;
  summary: string;
  context: string;
  role: string;
  outcome: string;
  /** Parcours d'utilisation, affiché en étapes numérotées sur l'étude de cas. */
  steps?: { title: string; text: string }[];
  /** Données produites par l'outil, affichées en pastilles sur l'étude de cas. */
  fields?: string[];
};

export type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    about: string;
    work: string;
    path: string;
    contact: string;
    cta: string;
    open: string;
    close: string;
    themeToDark: string;
    themeToLight: string;
    lang: string;
    skip: string;
    palette: string;
    cv: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    primary: string;
    secondary: string;
    available: string;
    scene: string;
    scroll: string;
    proofs: { k: string; v: string }[];
  };
  about: {
    index: string;
    title: string;
    paragraphs: string[];
    facts: { k: string; v: string }[];
  };
  widgets: {
    clock: string;
    open: string;
    closed: string;
    location: string;
    coords: string;
    response: string;
    responseValue: string;
    responseText: string;
    stack: string;
    stackHint: string;
  };
  projects: {
    index: string;
    title: string;
    text: string;
    view: string;
    visit: string;
    pair: string;
    pairNote: string;
  };
  cases: Record<ProjectSlug, ProjectCopy>;
  skills: {
    index: string;
    title: string;
    text: string;
    groups: { title: string; items: string[] }[];
  };
  journey: {
    index: string;
    title: string;
    text: string;
    steps: { period: string; title: string; text: string }[];
    servicesTitle: string;
    services: { title: string; text: string }[];
  };
  proof: {
    index: string;
    title: string;
    note: string;
    view: string;
    /** `quote` et `author` restent vides tant que le client n'a pas donné son avis. */
    items: {
      client: string;
      activity: string;
      project: ProjectSlug;
      text: string;
      quote?: string;
      author?: string;
    }[];
  };
  contact: {
    index: string;
    title: string;
    text: string;
    name: string;
    email: string;
    company: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    invalid: string;
    copy: string;
    copied: string;
  };
  palette: {
    placeholder: string;
    empty: string;
    sections: string;
    projects: string;
    actions: string;
    theme: string;
    language: string;
    copyEmail: string;
    copied: string;
    hint: string;
    downloadCv: string;
  };
  cv: {
    metaTitle: string;
    metaDescription: string;
    download: string;
    view: string;
    back: string;
    role: string;
    profileTitle: string;
    profile: string;
    experienceTitle: string;
    educationTitle: string;
    stackTitle: string;
    skillsTitle: string;
    languagesTitle: string;
    projectsTitle: string;
    toolkitTitle: string;
    onPage: string;
    pdfTitle: string;
    pdfText: string;
    license: string;
    phone: string;
    email: string;
    address: string;
    experience: { period: string; title: string; org: string; bullets: string[] }[];
    education: { period: string; title: string; school: string }[];
    stack: string[];
    skills: string[];
    languages: string[];
    selected: { name: string; url: string; text: string }[];
  };
  footer: { note: string; rights: string; top: string; local: string };
  caseStudy: {
    back: string;
    context: string;
    role: string;
    outcome: string;
    stack: string;
    year: string;
    next: string;
    steps: string;
    fields: string;
  };
  notFound: { title: string; text: string; back: string };
  error: { title: string; text: string; retry: string };
};
