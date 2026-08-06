import type { Metadata } from "next";
import { Station } from "@/components/ui/Station";
import { stations } from "@/data/stations";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Sum Adventures is a Lesotho-based tourism, photography and events company founded by Mpho Noko, run out of Hlotse, Leribe.",
  path: "/about",
});

const values = ["Adventure", "Community Development", "Sustainability", "Professionalism"];

const serviceLines = [
  {
    n: "01",
    name: "Adventure tours",
    examples: ["Weekend getaways", "Hiking expeditions", "Cultural tours", "Camping experiences"],
  },
  {
    n: "02",
    name: "Photography & videography",
    examples: ["Drone photography", "Destination marketing", "Business branding content"],
  },
  {
    n: "03",
    name: "Events management",
    examples: ["Corporate functions", "Tourism festivals", "Team building"],
  },
];

export default function AboutPage() {
  const s = stations[1];
  return (
    <section className="relative bg-ice pb-26 pt-[140px]">
      <div className="mx-auto max-w-[1180px] px-7">
        <Station elevation={s.elevation} place={s.place} tone="light" />
        <h1 className="type-display mt-5 max-w-[20ch] text-[clamp(30px,4vw,46px)] text-surface-dark">
          About Sum Adventures
        </h1>
        <p className="mt-5 max-w-[52ch] text-[16.5px] italic text-[#2F3E3C]">
          &ldquo;We believe every journey should become a story worth telling.&rdquo;
        </p>

        <div className="mt-16 grid gap-15 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="grid size-14 shrink-0 place-items-center rounded-md bg-gradient-to-br from-teal-deep to-surface-dark text-base text-white [font-variation-settings:'wdth'_112,'wght'_800]">
                MN
              </div>
              <div>
                <b className="block text-[15px] [font-variation-settings:'wdth'_100,'wght'_700] text-surface-dark">
                  Mpho Noko
                </b>
                <span className="font-mono text-[11.5px] tracking-[0.04em] text-[#586A67]">
                  Founder &amp; Chief Executive Officer
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-[#2F3E3C]">
              A Tourism Management graduate with a passion for adventure tourism,
              destination marketing, and community development. Mpho founded Sum
              Adventures to promote Lesotho as a premier travel destination while
              creating meaningful travel experiences that inspire exploration and
              cultural appreciation.
            </p>

            <h2 className="type-display mt-13 text-2xl text-surface-dark">Mission</h2>
            {/*
              EDITORIAL: condensed by us from the client's seven mission bullets
              (docs/client-profile.md). Pending Mpho's sign-off before launch.
            */}
            <p className="mt-4 max-w-[54ch] text-[15.5px] leading-relaxed text-[#2F3E3C]">
              Promote Lesotho as a world-class destination, create travel experiences
              worth remembering, and build the partnerships and community initiatives
              that grow tourism here — while helping local businesses tell their own
              story through photography and video.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#586A67]">
              Core values
            </h2>
            <ul>
              {values.map((value, i) => (
                <li
                  key={value}
                  className="flex items-baseline gap-3.5 border-b border-teal-deep/20 py-3.5 text-[15px] text-surface-dark"
                >
                  <span className="shrink-0 font-mono text-[11px] font-medium tracking-[0.1em] text-teal-deep">
                    0{i + 1}
                  </span>
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-teal-deep/20 pt-13">
          <h2 className="type-display text-2xl text-surface-dark">What we do</h2>
          <div className="mt-8 grid gap-9 md:grid-cols-3">
            {serviceLines.map((line) => (
              <div key={line.n}>
                <p className="flex items-center gap-3.5 font-mono text-xs uppercase tracking-[0.16em] text-[#586A67]">
                  <span className="text-teal-deep">{line.n}</span>
                  {line.name}
                </p>
                <ul className="mt-4 space-y-2">
                  {line.examples.map((item) => (
                    <li key={item} className="text-[14.5px] text-[#2F3E3C]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
