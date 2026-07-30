import { AltitudeRail } from "@/components/site/AltitudeRail";

/**
 * Route group for every page that carries the altitude rail — home, about,
 * tours. Contact sits outside this group deliberately: it's a transactional
 * page, not part of the elevation narrative, so the rail (and the per-
 * station pills it drives) simply isn't in its render tree at all.
 */
export default function RailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AltitudeRail />
      {children}
    </>
  );
}
