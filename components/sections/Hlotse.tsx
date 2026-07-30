import { Station } from "@/components/ui/Station";
import { stations, formatElevation } from "@/data/stations";

export function Hlotse() {
  const s = stations[1];
  const ledger = [
    ["Base town", `Hlotse · ${formatElevation(1631)}`],
    ["Highest tour", `Mahlasela · ${formatElevation(3222)}`],
    ["Service lines", "03"],
    ["Guides", "100% local"],
  ];

  return (
    <section id="hlotse" className="relative bg-snowline py-26">
      <div className="mx-auto max-w-[1180px] px-7 lg:pl-[152px]">
        <div className="grid gap-15 md:grid-cols-[1.15fr_0.85fr]">
          <div className="reveal">
            <Station elevation={s.elevation} place={s.place} tone="light" />
            <h2 className="type-display mt-5 text-[clamp(28px,3.9vw,44px)] text-senqu">
              Every journey becomes a story worth telling
            </h2>
            <p className="mt-5 max-w-[46ch] text-[16.5px] text-[#33456B]">
              Sum Adventures runs out of Leribe district — the same valley the Tsikoane
              plateau rises out of. Tourism, photography and events, built on knowing
              this ground rather than reading about it.
            </p>
            <div className="mt-7 flex items-center gap-3.5">
              {/* Placeholder until the client supplies a portrait. */}
              <div className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-maloti to-contour text-base text-white [font-variation-settings:'wdth'_112,'wght'_800]">
                MN
              </div>
              <div>
                <b className="block text-[15px] [font-variation-settings:'wdth'_100,'wght'_700]">
                  Mpho Noko
                </b>
                <span className="font-mono text-[11.5px] tracking-[0.04em] text-[#5B6C90]">
                  Founder &amp; CEO · Tourism Management
                </span>
              </div>
            </div>
          </div>

          <dl className="reveal border-t-2 border-senqu pt-1">
            {ledger.map(([term, value]) => (
              <div
                key={term}
                className="flex justify-between gap-4 border-b border-contour/20 py-4 text-[14.5px]"
              >
                <dt className="text-[#33456B]">{term}</dt>
                <dd className="type-data whitespace-nowrap text-[12.5px] text-minowane-deep">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
