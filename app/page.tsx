import { Hero } from "@/components/sections/Hero";
import { Hlotse } from "@/components/sections/Hlotse";
import { Tsikoane } from "@/components/sections/Tsikoane";
import { TourGrid } from "@/components/sections/TourGrid";

/**
 * Section order is determined by real elevation, ascending — not by
 * marketing convention. See data/stations.ts.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Hlotse />
      <Tsikoane />
      <TourGrid />
    </>
  );
}
