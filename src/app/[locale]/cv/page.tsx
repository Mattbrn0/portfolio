import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@content/index";
import { CvView } from "@/components/cv-view";
import { PageTransition } from "@/components/page-transition";
import { isLocale, publicPath, siteUrl } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const path = publicPath(locale, "/cv");
  return {
    title: dict.cv.metaTitle,
    description: dict.cv.metaDescription,
    alternates: {
      canonical: siteUrl() + path,
      languages: {
        fr: siteUrl() + publicPath("fr", "/cv"),
        en: siteUrl() + publicPath("en", "/cv"),
      },
    },
  };
}

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <PageTransition>
      <CvView dict={dict} locale={locale} />
    </PageTransition>
  );
}
