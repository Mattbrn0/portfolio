import { notFound } from "next/navigation";
import { getDictionary } from "@content/index";
import { Atelier } from "@/components/atelier";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { PageTransition } from "@/components/page-transition";
import { Testimonials } from "@/components/testimonials";
import { Work } from "@/components/work";
import { isLocale } from "@/lib/locale";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <PageTransition>
      <Hero dict={dict} locale={locale} />
      <Work dict={dict} locale={locale} />
      <Atelier dict={dict} />
      <Journey journey={dict.journey} />
      <Testimonials proof={dict.proof} locale={locale} />
      <Contact dict={dict} />
    </PageTransition>
  );
}
