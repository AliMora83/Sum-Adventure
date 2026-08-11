import type { Metadata } from "next";
import { AltitudeRail } from "@/components/site/AltitudeRail";
import { Hero } from "@/components/sections/Hero";
import { Hlotse } from "@/components/sections/Hlotse";
import { Tsikoane } from "@/components/sections/Tsikoane";
import { TourGrid } from "@/components/sections/TourGrid";
import { defaultTitle, defaultDescription } from "@/lib/site";

/**
 * The homepage does not use `buildMetadata()`.
 *
 * `title.absolute` opts out of the "%s — Sum Adventures" template, which
 * would otherwise render the brand title as
 * "Sum Adventures — More Than Just A Trip — Sum Adventures".
 *
 * `openGraph` is deliberately absent. Next replaces that object wholesale
 * rather than merging it, and the root layout's openGraph — brand title,
 * short description, "/" url, hero image, site name, locale — already *is*
 * the homepage's card. Declaring one here could only restate it, and would
 * drop whatever it forgot to restate.
 */
export const metadata: Metadata = {
  title: { absolute: defaultTitle },
  description: defaultDescription,
  alternates: { canonical: "/" },
};

/**
 * Section order is determined by real elevation, ascending — not by
 * marketing convention. See data/stations.ts.
 *
 * The rail is mounted HERE rather than in a shared layout, and that is the
 * whole point: it is the homepage's elevation spine, and every station it
 * plots (hero, hlotse, tsikoane, tours, footer) is a section of this page.
 * On About or Tours it plotted a journey those pages don't take. It is
 * `position: fixed`, so mounting it inside the page tree costs it nothing.
 */
export default function Home() {
  return (
    <>
      <AltitudeRail />
      <Hero />
      <Hlotse />
      <Tsikoane />
      <TourGrid />
    </>
  );
}
