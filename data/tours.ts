/**
 * Real products, priced off the client's own flyers. No invented tours.
 * `elevation` places each tour on the altitude spine.
 */
export type Tour = {
  slug: string;
  name: string;
  duration: string;
  /** ZAR per person, the "from" price */
  priceFrom: number;
  priceNote?: string;
  elevation: number | null;
  place: string;
  blurb: string;
  includes: string[];
  minPax?: number;
  image: string;
  imageAlt: string;
  flagship?: boolean;
  /**
   * A 'past' tour must never present as bookable — no price CTA, no Enquire
   * button, no WhatsApp link. See CLAUDE.md and docs/client-profile.md.
   */
  status: "upcoming" | "past";
  /**
   * Customer-facing availability line, rendered verbatim next to the price.
   *
   * **This is not a date field and must never become one.** It carries no
   * value a date can be parsed out of, and nothing infers bookability from
   * it — `status` remains the only source of truth for that (CLAUDE.md
   * invariant 8). It exists because "when does this run?" is the first
   * question a seasonal product raises, and leaving it unanswered invites
   * the reader to assume the flyer date still stands.
   *
   * Set it only from what the client has actually said. Do not write a month
   * range, a season window or a snow-condition claim into it: the site does
   * not know when the Afriski season opens or closes, and that question is
   * still outstanding with Mpho.
   */
  availability?: string;
};

/**
 * The one seasonal-availability string, defined once so the two render sites
 * — the homepage card and the tour detail panel — cannot drift apart.
 *
 * The separator is U+00B7 MIDDLE DOT, matching every other `·` on the site.
 * It says what is known (the trip is seasonal, dates are agreed per enquiry)
 * and claims nothing that is not: no months, no season window, no snow.
 */
export const SEASONAL_AVAILABILITY = "Seasonal · departure dates on enquiry";

export const tours: Tour[] = [
  {
    slug: "afriski-winter-day-trip",
    name: "Afriski Winter Day Trip",
    duration: "1 day",
    priceFrom: 900,
    priceNote: "R1,100 with bum boarding",
    elevation: 3222,
    place: "Mahlasela Pass",
    blurb:
      "Snow in Lesotho, and back the same day. Transport and entry included, departing Maputsoe.",
    includes: ["Return transport", "Afriski entry", "Snow play", "Photo stops"],
    image: "/images/skii-3.jpg",
    imageAlt: "Visitors in the snow at Afriski, Lesotho",
    status: "upcoming",
    // The one flyer this was priced off carried a single Saturday date, which
    // lapsed and briefly took the tour to `status: "past"` in Sprint 4.5. The
    // client's position since Sprint 5.5 is that it is a standing activity
    // with dates agreed per enquiry, so the page now says exactly that rather
    // than leaving the reader to guess. Sprint 9.
    availability: SEASONAL_AVAILABILITY,
  },
  {
    slug: "tsikoane-plateau-camping",
    name: "Tsikoane Plateau Camping",
    duration: "3 days / 2 nights",
    priceFrom: 2200,
    elevation: 1881,
    place: "Tsikoane, Leribe",
    blurb:
      "Minowane on the cave ceiling, San rock art, horse riding and Basotho meals under the stars.",
    includes: [
      "Guided hiking",
      "Menoaneng caves",
      "San rock art",
      "Horse riding",
      "Yoga and sound therapy",
      "Traditional meals",
      "Bonfire",
      "Sunrise photography",
    ],
    image: "/images/horse-riding.jpg",
    imageAlt: "Horse riding on the Tsikoane plateau",
    flagship: true,
    status: "upcoming",
  },
  {
    slug: "ultimate-afriski-weekend",
    name: "Sum Ultimate Afriski Weekend",
    duration: "Full weekend",
    priceFrom: 4600,
    elevation: 3222,
    place: "Mahlasela Pass",
    blurb:
      "Accommodation, breakfast, snowpass, gear, a ski lesson and tubing. One full winter getaway.",
    includes: [
      "Accommodation",
      "Daily breakfast",
      "Transport",
      "Afriski entry",
      "Full snowpass",
      "Equipment rental",
      "Ski lesson",
      "Tubing",
    ],
    minPax: 6,
    image: "/images/skii-5.jpg",
    imageAlt: "Skier descending a slope at Afriski, Lesotho",
    status: "upcoming",
  },
];

export function formatPrice(zar: number): string {
  return `R${zar.toLocaleString("en-ZA")}`;
}

/**
 * The single predicate for "is this tour past". `status` is the only source
 * of truth — nothing infers it from a date (see CLAUDE.md invariant 8).
 * Used by the badge and by the metadata description so the two cannot drift.
 */
export function isPastTour(tour: Pick<Tour, "status">): boolean {
  return tour.status === "past";
}

/** The customer-facing wording for that status, in one place. */
export const PAST_TOUR_LABEL = "Past trip";

/**
 * Description for share cards and search snippets.
 *
 * A past tour's blurb reads as a live offer on its own — "Snow in Lesotho,
 * and back the same day. Transport and entry included" is indistinguishable
 * from a bookable trip. On the page that's fine: the badge, the missing price
 * CTA and the missing Enquire button all say otherwise. A search result or a
 * shared link has none of those. The description is the only signal that
 * travels, so the status has to ride inside it, and it goes first so it
 * survives truncation.
 */
export function tourDescription(tour: Pick<Tour, "status" | "blurb">): string {
  return isPastTour(tour)
    ? `${PAST_TOUR_LABEL} — this has already run. ${tour.blurb}`
    : tour.blurb;
}
