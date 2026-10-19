import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getDictionary } from "@content/index";
import { CvDocument } from "@/lib/cv-document";
import { isLocale, type Locale } from "@/lib/locale";

export const runtime = "nodejs";

function filename(locale: Locale) {
  return locale === "en" ? "Resume-Mathis-Bricman.pdf" : "CV-Mathis-Bricman.pdf";
}

export async function GET(request: Request) {
  const localeParam = new URL(request.url).searchParams.get("locale") ?? "fr";
  const locale: Locale = isLocale(localeParam) ? localeParam : "fr";
  const dict = getDictionary(locale);
  const buffer = await renderToBuffer(<CvDocument dict={dict} locale={locale} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename(locale)}"`,
      "Cache-Control": "no-store",
    },
  });
}
