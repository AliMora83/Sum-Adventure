import type { Metadata } from "next";
import { archivo, plexMono } from "@/lib/fonts";
import { Masthead } from "@/components/site/Masthead";
import { Footer } from "@/components/site/Footer";
import { MobileBar } from "@/components/site/MobileBar";
import { ScrollProgress } from "@/components/site/AltitudeRail";
import {
  siteUrl,
  siteName,
  defaultTitle,
  titleTemplate,
  defaultDescription,
  shortDescription,
  defaultOgImage,
  ogLocale,
} from "@/lib/site";
import "./globals.css";

/**
 * Site-wide metadata defaults. Routes override via `buildMetadata()` and pass
 * a bare title; the brand suffix comes from the templates below.
 *
 * The template is repeated onto openGraph and twitter deliberately — Next
 * does not apply `title.template` to `openGraph.title`, so without its own
 * template every share card would lose the brand name.
 */
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: defaultTitle,
    template: titleTemplate,
  },
  description: defaultDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    locale: ogLocale,
    siteName,
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: shortDescription,
    url: "/",
    images: [defaultOgImage],
  },
  twitter: {
    // No handle: social accounts are [UNCONFIRMED] in docs/client-profile.md,
    // so `site`/`creator` stay unset rather than guessed.
    card: "summary_large_image",
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: shortDescription,
    images: [defaultOgImage.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <Masthead />
        <ScrollProgress />
        <main>{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
