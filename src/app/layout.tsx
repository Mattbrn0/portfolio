import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { siteUrl } from "@/lib/locale";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  applicationName: "Mathis Bricman",
  authors: [{ name: "Mathis Bricman", url: siteUrl() }],
  creator: "Mathis Bricman",
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#f1f1f1" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geist.variable} ${bricolage.variable} h-full`}
    >
      <body suppressHydrationWarning className="min-h-full bg-bg font-sans text-ink">
        <Script id="locale-lang" strategy="beforeInteractive">
          {`try{document.documentElement.lang=location.pathname==="/en"||location.pathname.startsWith("/en/")?"en":"fr"}catch(e){}`}
        </Script>
        {plausible ? (
          <Script defer data-domain={plausible} src={plausibleSrc} strategy="afterInteractive" />
        ) : null}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
