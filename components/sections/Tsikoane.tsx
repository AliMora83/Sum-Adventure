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
    <section id="tsikoane" className="relative overflow-hidden bg-maloti pb-26 text-white">
      {/* The cave ceiling. Prints read as impressions: dark fill with a
          light lip offset 2px above. */}
      <div className="relative z-10 h-[190px] overflow-hidden bg-gradient-to-b from-senqu via-[#122C5B] to-maloti">
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 150"
          preserveAspectRatio="xMidYMin slice"
          className="anim-tracks absolute inset-x-0 top-0 h-[150px] w-full"
        >
          <g fill="#0A1B3D" opacity="0.85">
            {printPositions.map((t) => (
              <g key={t} transform={t}>
                <MinowanePrint />
              </g>
            ))}
          </g>
          <g fill="#A8CDEB" opacity="0.22" transform="translate(0 -2)">
            {printPositions.map((t) => (
              <g key={t} transform={t}>
                <MinowanePrint />
              </g>
            ))}
          </g>
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-mahlasela/50 to-transparent" />
      </div>

      <div className="anim-overhang absolute -inset-y-[8%] inset-x-0 bg-gradient-to-b from-[#1F4480] via-maloti to-senqu" />
      <Contours depth="far" />

      <div className="relative z-10 mx-auto max-w-[1180px] px-7 pt-18 lg:pl-[152px]">
        <div className="reveal">
          <Station elevation={s.elevation} place={s.place} provisional={s.provisional} />
          <h2 className="type-display mt-5 text-[clamp(30px,4.4vw,52px)]">
            The footprints are
            <br />
            <em className="not-italic text-minowane">above your head</em>
          </h2>
          <p className="mt-5 max-w-[50ch] text-[16.5px] text-[#d3e3f4]">
            You climb roughly a kilometre up the mountainside to the Menoaneng caves.
            The minowane aren&rsquo;t underfoot — they&rsquo;re pressed into the rock
            ceiling, preserved for over 200 million years by the way the overhang formed.
          </p>
          <p className="mt-3.5 max-w-[52ch] font-mono text-xs tracking-[0.03em] text-mahlasela">
            minowane (n., Sesotho) — dinosaur footprints. Lesotho holds some of the most
            complete trackways on earth.
          </p>
        </div>

        <div className="mt-13 grid gap-11 md:grid-cols-2">
          <div className="reveal">
            <p className="mb-3.5 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.16em] text-mahlasela">
              <span className="h-px w-10 bg-current opacity-30" />
              Summit passes
            </p>
            <ul>
              {passes.filter((p) => p.confirmed).map((p) => (
                <li
                  key={p.n}
                  className="flex items-baseline gap-3.5 border-b border-mahlasela/15 py-3.5 text-[15px]"
                >
                  <span className="shrink-0 font-mono text-[11px] font-medium tracking-[0.1em] text-minowane">
                    {p.n}
                  </span>
                  {p.name}
                  <span className="ml-auto shrink-0 font-mono text-[11px] tracking-[0.04em] text-mahlasela">
                    {p.note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3.5 font-mono text-[11px] tracking-[0.03em] text-mahlasela/70">
              Six passes reach the summit — five more names to come as they&rsquo;re
              confirmed.
            </p>
          </div>

          <div className="reveal">
            <div className="border border-mahlasela/25 bg-senqu/40 p-8">
              <div className="type-data text-[clamp(38px,5vw,56px)] leading-none tracking-tight text-minowane">
                {formatPrice(tour.priceFrom)}
              </div>
              <div className="mt-2.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-mahlasela">
                per person · {tour.duration}
              </div>
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
