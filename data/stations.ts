/**
 * The altitude spine. Section order on the homepage is determined by real
 * elevation, ascending. Every number here must survive a customer
 * fact-checking it — no estimates, no superlatives we cannot defend.
 *
 * `elevation: null` renders as "Elev. TBC" rather than a guess.
 */
export type Station = {
  id: string;
  /** metres above sea level, or null if unverified */
  elevation: number | null;
  place: string;
  /** x position on the rail profile, 20-58 in the rail's 132-unit viewBox */
  railX: number;
  railY: number;
  /**
   * Fenced exception to "never invent a number" — see CLAUDE.md invariant 5.
   * Set ONLY on Tsikoane, and only until the client supplies a real figure.
   * Every place a provisional elevation renders must show it as visibly
   * unconfirmed. Guarded below so it can't ship to a live domain.
   */
  provisional?: boolean;
};

export const stations: Station[] = [
  { id: "hero",     elevation: 1400, place: "Lowest point in Lesotho", railX: 20, railY: 60 },
  { id: "hlotse",   elevation: 1631, place: "Hlotse, Leribe",          railX: 23, railY: 180 },
  { id: "tsikoane", elevation: 2600, place: "Tsikoane plateau",        railX: 26, railY: 300, provisional: true },
  { id: "tours",    elevation: 3222, place: "Mahlasela Pass",          railX: 52, railY: 420 },
  { id: "enquire",  elevation: 3482, place: "Thabana Ntlenyana",       railX: 58, railY: 540 },
];

/**
 * Build guard for the provisional exception above. A provisional elevation
 * is fine on localhost, where it exists so the rail draws correctly during
 * design work — it must never reach the client's live domain. A warning
 * isn't enough here; a warning is exactly what let a stray dummy value
 * ("3798m") sit unnoticed for four sprints. This throws at build/import
 * time, which aborts `next build`.
 */
function isLocalSiteUrl(url: string | undefined): boolean {
  if (!url) return true;
  try {
    return new URL(url).hostname === "localhost";
  } catch {
    return true;
  }
}

if (!isLocalSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)) {
  for (const s of stations) {
    if (s.provisional) {
      throw new Error(
        `data/stations.ts: station "${s.id}" (${s.place}) has a provisional ` +
          `elevation (${s.elevation} m) but NEXT_PUBLIC_SITE_URL is set to ` +
          `"${process.env.NEXT_PUBLIC_SITE_URL}", not localhost. Provisional ` +
          `data must never ship to a live domain — get the real figure from ` +
          `the client, or unset NEXT_PUBLIC_SITE_URL if this really is a ` +
          `local/preview build.`
      );
    }
  }
}

export const railPath = stations
  .map((s, i) => `${i === 0 ? "M" : "L"}${s.railX} ${s.railY}`)
  .join(" ");

/** Approximate length of railPath, for the stroke-dashoffset draw. */
export const railPathLength = 483;

export function formatElevation(m: number | null): string {
  return m === null ? "Elev. TBC" : `${m.toLocaleString("en-ZA")} m`;
}
