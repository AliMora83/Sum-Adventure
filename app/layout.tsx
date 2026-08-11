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
import { organizationJsonLdString } from "@/data/organization";
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
        {/*
          JSON-LD organisation markup.

          NOT A ZERO-JS VIOLATION, and must not be flagged as one in a future
          session. `type="application/ld+json"` is inert: the browser does not
          parse or execute it as script, it ships no runtime, adds no client
          boundary, and hydrates nothing. It is a data block that happens to
          use the <script> element, which is the only element the schema.org
          spec allows for it. The invariant is about shipped JavaScript, and
          this ships none.

          Values and the build guard live in data/organization.ts. Several
          fields are still placeholders awaiting the client, and that guard is
          what stops them reaching a deployed environment.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLdString() }}
        />
        {/* First focusable element on every page, before the masthead, so a
            keyboard user's very first Tab offers it. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Masthead />
        <ScrollProgress />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
