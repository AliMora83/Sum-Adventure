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
};

export const stations: Station[] = [
  { id: "hero",     elevation: 1400, place: "Lowest point in Lesotho", railX: 20, railY: 60 },
  { id: "hlotse",   elevation: 1631, place: "Hlotse, Leribe",          railX: 23, railY: 180 },
  { id: "tsikoane", elevation: null, place: "Tsikoane plateau",        railX: 26, railY: 300 },
  { id: "tours",    elevation: 3222, place: "Mahlasela Pass",          railX: 52, railY: 420 },
  { id: "enquire",  elevation: 3482, place: "Thabana Ntlenyana",       railX: 58, railY: 540 },
];

export const railPath = stations
  .map((s, i) => `${i === 0 ? "M" : "L"}${s.railX} ${s.railY}`)
  .join(" ");

/** Approximate length of railPath, for the stroke-dashoffset draw. */
export const railPathLength = 483;

export function formatElevation(m: number | null): string {
  return m === null ? "Elev. TBC" : `${m.toLocaleString("en-ZA")} m`;
}
