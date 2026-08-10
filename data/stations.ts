import { assertNoProvisional } from "@/lib/provisional";

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
   * Currently set on NO station: Tsikoane, the only station that ever carried
   * it, was confirmed at 1,881 m by the client and the flag was removed.
   *
   * The mechanism stays for the next figure that needs it. If you set this,
   * every place the elevation renders must show it as visibly unconfirmed
   * (dashed pill, "prov." suffix — Station.tsx and AltitudeRail.tsx already
   * do this), and the guard below will block production builds until a real
   * figure replaces it.
   */
  provisional?: boolean;
};

export const stations: Station[] = [
  { id: "hero",     elevation: 1400, place: "Lowest point in Lesotho", railX: 20, railY: 60 },
  { id: "hlotse",   elevation: 1631, place: "Hlotse, Leribe",          railX: 23, railY: 180 },
  { id: "tsikoane", elevation: 1881, place: "Tsikoane plateau",        railX: 26, railY: 300 },
  { id: "tours",    elevation: 3222, place: "Mahlasela Pass",          railX: 52, railY: 420 },
  { id: "enquire",  elevation: 3482, place: "Thabana Ntlenyana",       railX: 58, railY: 540 },
];

/**
 * Build guard for the provisional exception above.
 *
 * As of Sprint 7 no station is flagged, so `offenders` is empty and
 * production builds pass. That is the correct resting state — the guard is
 * not dead code awaiting deletion, it is the mechanism that makes the
 * exception safe to use again. Leave it in place.
 *
 * A provisional elevation exists so the rail draws correctly during design
 * work, and it is *meant* to be visible on localhost and on preview deploys
 * — reviewing it there is the entire point of carrying it. Hence scope
 * "production": preview must keep rendering it, visibly unconfirmed.
 *
 * Keyed on CONTEXT — Netlify's build context — not on NEXT_PUBLIC_SITE_URL.
 * The original check fired whenever the site URL was non-localhost, which is
 * true of every preview deploy, so it broke exactly the builds that are
 * supposed to show the provisional value. NEXT_PUBLIC_SITE_URL is a canonical
 * origin shared by every environment (see lib/site.ts) and says nothing about
 * which environment is building; CONTEXT is the signal that separates a
 * production deploy from a preview one. It was VERCEL_ENV until Sprint 9,
 * which is unset on Netlify and left this guard unable to fire at all.
 *
 * The throwing mechanism itself now lives in lib/provisional.ts, shared with
 * the JSON-LD guard in data/organization.ts. Behaviour here is unchanged.
 */
assertNoProvisional({
  source: "data/stations.ts",
  scope: "production",
  offenders: stations
    .filter((s) => s.provisional)
    .map(
      (s) =>
        `station "${s.id}" (${s.place}) — provisional elevation ${s.elevation} m`
    ),
  remedy:
    `Get the real figure from the client and delete the \`provisional\` ` +
    `flag. Preview and local builds are unaffected and will keep rendering ` +
    `it as visibly unconfirmed.`,
});

export const railPath = stations
  .map((s, i) => `${i === 0 ? "M" : "L"}${s.railX} ${s.railY}`)
  .join(" ");

/** Approximate length of railPath, for the stroke-dashoffset draw. */
export const railPathLength = 483;

export function formatElevation(m: number | null): string {
  return m === null ? "Elev. TBC" : `${m.toLocaleString("en-ZA")} m`;
}
