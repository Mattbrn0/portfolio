import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@content/index";
import { profile } from "@content/projects";
import { Backdrop } from "@/components/backdrop";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionProvider } from "@/components/motion-provider";
import { isLocale, locales, publicPath, siteUrl, type Locale } from "@/lib/locale";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);
  const url = siteUrl() + publicPath(raw);
  return {
    title: { default: dict.meta.title, template: `%s — ${profile.name}` },
    description: dict.meta.description,
    alternates: {
      canonical: url,
      languages: {
        fr: siteUrl() + publicPath("fr"),
        en: siteUrl() + publicPath("en"),
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url,
      locale: raw === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: dict.meta.title }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: profile.email,
    url: siteUrl() + publicPath(locale),
    address: { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "FR" },
    sameAs: [profile.github, profile.linkedin],
  };

  return (
    <MotionProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        {dict.nav.skip}
      </a>
      <Backdrop />
      <Header dict={dict} locale={locale} />
      <main id="contenu">{children}</main>
      <Footer dict={dict} />
      <CommandPalette dict={dict} locale={locale} />
    </MotionProvider>
  );
}
