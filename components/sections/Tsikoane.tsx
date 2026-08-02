import Image from "next/image";
import { Station } from "@/components/ui/Station";
import { Contours } from "@/components/ui/Contours";
import { Button } from "@/components/ui/Button";
import { stations } from "@/data/stations";
import { tours, formatPrice } from "@/data/tours";
import { tourEnquiryLink } from "@/lib/whatsapp";

/**
 * Six named passes reach the summit. Only Linareng is confirmed — the
 * caves route. The other five are placeholders pending the client, kept
 * here (not deleted) so they render automatically once named — see the
 * render-time filter below.
 */
const passes = [
  { n: "01", name: "Linareng Pass", note: "caves route", confirmed: true },
  { n: "02", name: "Pass two", note: "name tbc", confirmed: false },
  { n: "03", name: "Pass three", note: "name tbc", confirmed: false },
  { n: "04", name: "Pass four", note: "name tbc", confirmed: false },
  { n: "05", name: "Pass five", note: "name tbc", confirmed: false },
  { n: "06", name: "Pass six", note: "name tbc", confirmed: false },
];

/**
 * Condensed from the full inclusions list in docs/client-profile.md — the
 * five that sell the trip (dinosaur footprints, San rock art, horse riding,
 * traditional Basotho meals, the bonfire), not the full eleven. Yoga, sound
 * therapy and team building are real inclusions too but don't belong in a
 * space this tight.
 */
const priceHighlights = [
  "Dinosaur footprints",
  "San rock art",
  "Horse riding",
  "Traditional Basotho meals",
  "Bonfire",
];

/** Tridactyl print — three toes and a pad. Vector, not photographic. */
function MinowanePrint() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="7" ry="12" />
      <ellipse cx="-13" cy="-9" rx="4.4" ry="13" transform="rotate(-26 -13 -9)" />
      <ellipse cx="0" cy="-17" rx="4.4" ry="14" />
      <ellipse cx="13" cy="-9" rx="4.4" ry="13" transform="rotate(26 13 -9)" />
    </g>
  );
}

const printPositions = [
  "translate(210 52) rotate(188) scale(1.05)",
  "translate(392 88) rotate(174) scale(0.92)",
  "translate(576 46) rotate(193) scale(1.12)",
  "translate(768 92) rotate(178) scale(0.96)",
  "translate(952 50) rotate(186) scale(1.06)",
  "translate(1148 90) rotate(171) scale(0.9)",
];

export function Tsikoane() {
  const s = stations[2];
  const tour = tours.find((t) => t.flagship)!;

  return (
    <section id="tsikoane" className="relative overflow-hidden bg-surface-dark pb-26 text-white">
      {/* The cave ceiling. Prints read as impressions: dark fill with a
          light lip offset 2px above. */}
      <div className="relative z-10 h-[190px] overflow-hidden bg-gradient-to-b from-surface-dark via-[#0B3A35] to-[#0E4843]">
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 150"
          preserveAspectRatio="xMidYMin slice"
          className="anim-tracks absolute inset-x-0 top-0 h-[150px] w-full"
        >
          <g fill="#072B28" opacity="0.85">
            {printPositions.map((t) => (
              <g key={t} transform={t}>
                <MinowanePrint />
              </g>
            ))}
          </g>
          <g fill="#A8DCD6" opacity="0.22" transform="translate(0 -2)">
            {printPositions.map((t) => (
              <g key={t} transform={t}>
                <MinowanePrint />
              </g>
            ))}
          </g>
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-light/50 to-transparent" />
      </div>

      {/* The overhang. Still the inversion layer — .anim-overhang travels
          DOWN as you scroll down, and the photograph now rides it, so the
          rock face recedes above you instead of the flat gradient doing it
          alone. Real minowane, client-supplied: the vector prints on the
          ceiling above stay vector, this is the wall behind the copy.

          The scrim is the section's own gradient composited over the
          photograph, which is the only way to have both on screen at once.
          Opacity stays at 0.94, set by contrast rather than taste.

          THE STOPS ARE A CONTRAST CONSTRAINT, NOT A COLOUR CHOICE. They ramp
          #0E4843 -> #0B3A35 -> surface-dark: three dark teals, deliberately
          narrow. The obvious repalette of the old navy ramp was a mid teal at
          the top (#1C7A70), and it broke two things at once — the gold <em>
          in the h2 fell to 2.68:1 against the 3.0 AA wants for large text,
          and the teal-light mono gloss fell to 2.82:1 against 4.5. teal-light
          is specified for "accents on dark surfaces" and delivers 6.81:1 on
          surface-dark; a mid-teal scrim simply isn't a dark surface any more.

          Measured per-pixel over the composited image across the full
          parallax excursion, worst case, at these stops:
            h2 white       10.44:1  (need 3.0)
            h2 <em> gold    4.96:1  (need 3.0)
            body            8.60:1  (need 4.5)
            mono gloss      5.03:1  (need 4.5)
            price gold      6.16:1  (need 3.0, inside the surface-dark/40 panel)

          Do not lighten these stops to show more of the photograph, and do
          not fix a failure here by changing the type colour — gold on a large
          display heading over a dark surface is its sanctioned use, and gold
          is never permitted on a light one (1.94:1 on ice). If the section
          needs more rock visible, the answer is a darker crop, measured
          again. */}
      <div className="anim-overhang absolute -inset-y-[8%] inset-x-0 bg-surface-dark">
        <Image
          src="/images/footprints-2.jpeg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E4843] via-[#0B3A35] to-surface-dark opacity-[0.94]" />
      </div>
      <Contours depth="far" />

      <div className="relative z-10 mx-auto max-w-[1180px] px-7 pt-18 lg:pl-[152px]">
        <div className="reveal">
          <Station elevation={s.elevation} place={s.place} provisional={s.provisional} />
          <h2 className="type-display mt-5 text-[clamp(30px,4.4vw,52px)]">
            The footprints are
            <br />
            <em className="not-italic text-gold">above your head</em>
          </h2>
          <p className="mt-5 max-w-[50ch] text-[16.5px] text-[#D3E9E5]">
            You climb roughly a kilometre up the mountainside to the Menoaneng caves.
            The minowane aren&rsquo;t underfoot — they&rsquo;re pressed into the rock
            ceiling, preserved for over 200 million years by the way the overhang formed.
          </p>
          <p className="mt-3.5 max-w-[52ch] font-mono text-xs tracking-[0.03em] text-teal-light">
            minowane (n., Sesotho) — dinosaur footprints. Lesotho holds some of the most
            complete trackways on earth.
          </p>
        </div>

        <div className="mt-13 grid gap-11 md:grid-cols-2">
          <div className="reveal">
            <p className="mb-3.5 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.16em] text-teal-light">
              <span className="h-px w-10 bg-current opacity-30" />
              Summit passes
            </p>
            <ul>
              {passes.filter((p) => p.confirmed).map((p) => (
                <li
                  key={p.n}
                  className="flex items-baseline gap-3.5 border-b border-teal-light/15 py-3.5 text-[15px]"
                >
                  <span className="shrink-0 font-mono text-[11px] font-medium tracking-[0.1em] text-gold">
                    {p.n}
                  </span>
                  {p.name}
                  <span className="ml-auto shrink-0 font-mono text-[11px] tracking-[0.04em] text-teal-light">
                    {p.note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3.5 font-mono text-[11px] tracking-[0.03em] text-teal-light">
              Six passes reach the summit — five more names to come as they&rsquo;re
              confirmed.
            </p>
          </div>

          <div className="reveal">
            <div className="border border-teal-light/25 bg-surface-dark/40 p-8">
              <div className="type-data text-[clamp(38px,5vw,56px)] leading-none tracking-tight text-gold">
                {formatPrice(tour.priceFrom)}
              </div>
              <div className="mt-2.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-teal-light">
                per person · {tour.duration}
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-dashed border-teal-light/25 pt-5">
                {priceHighlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[12.5px] text-teal-light">
                    <span className="h-1 w-1 shrink-0 rounded-sm bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                href={tourEnquiryLink(tour)}
                external
                className="mt-6 w-full justify-center"
              >
                Enquire on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
