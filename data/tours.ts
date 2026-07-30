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
};

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
  },
  {
    slug: "tsikoane-plateau-camping",
    name: "Tsikoane Plateau Camping",
    duration: "3 days / 2 nights",
    priceFrom: 2200,
    elevation: null,
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
  },
];

export function formatPrice(zar: number): string {
  return `R${zar.toLocaleString("en-ZA")}`;
}
