import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@content/index";
import { projectDomain, projects, type ProjectSlug } from "@content/projects";
import { PageTransition } from "@/components/page-transition";
import { TiltShot } from "@/components/tilt-shot";
import { ArrowRight, ArrowUpRight, MagneticAnchor, RevealTitle } from "@/components/ui";
import { isLocale, locales, publicPath, siteUrl } from "@/lib/locale";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export const dynamicParams = false;

function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = findProject(slug);
  if (!project) return {};
  const copy = getDictionary(locale).cases[project.slug];
  const path = publicPath(locale, `/projets/${project.slug}`);
  return {
    title: copy.title,
    description: copy.summary,
    alternates: {
      canonical: siteUrl() + path,
      languages: {
        fr: siteUrl() + publicPath("fr", `/projets/${project.slug}`),
        en: siteUrl() + publicPath("en", `/projets/${project.slug}`),
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.summary,
      url: siteUrl() + path,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: copy.title }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = findProject(slug);
  if (!project) notFound();

  const dict = getDictionary(locale);
  const copy = dict.cases[project.slug as ProjectSlug];
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  if (!next) notFound();
  const nextCopy = dict.cases[next.slug];
  const domain = projectDomain(project.url);

  const sections = [
    { title: dict.caseStudy.context, text: copy.context },
    { title: dict.caseStudy.role, text: copy.role },
    { title: dict.caseStudy.outcome, text: copy.outcome },
  ];

  return (
    <PageTransition>
      <article className="px-3 pt-28 pb-10 md:px-6 md:pt-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="px-2 md:px-4">
            <Link
              href={publicPath(locale, "/#projets")}
              transitionTypes={["nav-back"]}
              className="glass-thin inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition-transform duration-500 ease-fluid hover:-translate-x-0.5"
            >
              <ArrowRight className="rotate-180" />
              {dict.caseStudy.back}
            </Link>

            <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
              <div>
                <p className="text-[15px] text-muted">{copy.client}</p>
                <RevealTitle
                  as="h1"
                  text={copy.title}
                  className="display mt-4 text-[clamp(3.2rem,10vw,9.5rem)]"
                />
                <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">{copy.summary}</p>
              </div>
              <dl className="glass grid gap-4 rounded-[28px] p-6 text-sm">
                <div className="flex justify-between gap-4 border-b border-line pb-4">
                  <dt className="text-muted">{dict.caseStudy.year}</dt>
                  <dd className="tabular font-medium">{project.year}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-4">
                  <dt className="text-muted">{dict.caseStudy.stack}</dt>
                  <dd className="text-right font-medium">{project.stack.join(", ")}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">{dict.projects.visit}</dt>
                  <dd>
                    <MagneticAnchor
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 px-4 text-sm"
                    >
                      {domain}
                      <ArrowUpRight />
                    </MagneticAnchor>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="glass mt-12 rounded-[36px] p-2 md:rounded-[44px] md:p-3">
            <TiltShot
              slug={project.slug}
              domain={domain}
              alt={copy.title}
              priority
              tilt={false}
              sizes="(min-width: 1320px) 1290px, 100vw"
            />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4">
            {sections.map((section) => (
              <section key={section.title} className="glass rounded-[32px] p-7 md:p-8">
                <h2 className="text-sm text-muted">{section.title}</h2>
                <p className="mt-4 text-lg leading-relaxed">{section.text}</p>
              </section>
            ))}
          </div>

          <Link
            href={publicPath(locale, `/projets/${next.slug}`)}
            transitionTypes={["nav-forward"]}
            className="glass group mt-24 grid items-center gap-6 overflow-hidden rounded-[36px] p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:rounded-[44px] md:p-4"
          >
            <div className="px-4 py-4 md:px-8">
              <p className="text-sm text-muted">{dict.caseStudy.next}</p>
              <p className="display mt-4 text-[clamp(2.6rem,6vw,5.6rem)]">{nextCopy.title}</p>
              <p className="mt-3 max-w-sm text-muted">{nextCopy.client}</p>
              <span className="mt-8 inline-grid size-14 place-items-center rounded-full bg-ink text-bg transition-transform duration-700 ease-fluid group-hover:translate-x-2 group-hover:-rotate-45">
                <ArrowRight className="size-5" />
              </span>
            </div>
            <div className="transition-transform duration-700 ease-fluid group-hover:scale-[1.02]">
              <TiltShot
                slug={next.slug}
                domain={projectDomain(next.url)}
                alt=""
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </Link>
        </div>
      </article>
    </PageTransition>
  );
}
