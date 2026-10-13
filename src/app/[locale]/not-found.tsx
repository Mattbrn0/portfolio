"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@content/index";
import { publicPath, type Locale } from "@/lib/locale";

export default function NotFound() {
  const pathname = usePathname();
  const locale: Locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
  const dict = getDictionary(locale);

  return (
    <section className="grid min-h-svh place-items-center px-4 pt-24">
      <div className="glass max-w-lg rounded-[36px] p-10 text-center">
        <p className="display text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{dict.notFound.title}</h1>
        <p className="mt-3 text-muted">{dict.notFound.text}</p>
        <Link
          href={publicPath(locale)}
          className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-transform duration-500 ease-fluid hover:scale-[1.04]"
        >
          {dict.notFound.back}
        </Link>
      </div>
    </section>
  );
}
