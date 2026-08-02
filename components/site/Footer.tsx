import Link from "next/link";
import { PHONE_DISPLAY, EMAIL } from "@/lib/whatsapp";
import { stations, formatElevation } from "@/data/stations";

export function Footer() {
  const summit = stations[stations.length - 1];
  return (
    <footer className="bg-surface-dark pb-24 pt-14 text-teal-light sm:pb-14">
      <div className="mx-auto max-w-[1180px] px-7 lg:pl-[152px]">
        <div className="grid gap-9 md:grid-cols-4">
          <div className="md:col-span-2">
            {/*
              TODO: replace with the knockout/reversed logo variant of
              public/sum-logo.png once the client supplies it (expected this
              week). Until then this is the wordmark in display type and no
              mark at all.

              sum-logo.png is a teal pin with a dark-grey wordmark sitting on
              white. On surface-dark the grey tagline disappears entirely and
              the white background would show as a hard rectangle. It is not
              usable here. Do NOT invert, recolour, filter or knock out the
              existing PNG as a stand-in — a recoloured brand mark is an
              invented asset, and the real one is days away.
            */}
            <p className="type-display text-2xl text-white">Sum Adventures</p>
            <p className="mt-3 font-mono text-xs tracking-[0.1em]">
              Tourism · Photography · Events
              <br />
              Hlotse, Leribe · Lesotho
            </p>
          </div>
          <div>
            <h2 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              Explore
            </h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tours" className="hover:text-gold">Tours &amp; packages</Link></li>
              <li><Link href="/#tsikoane" className="hover:text-gold">Tsikoane experience</Link></li>
              <li><Link href="/about" className="hover:text-gold">About</Link></li>
              <li><Link href="/contact" className="hover:text-gold">Enquire</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              Contact
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="font-mono text-xs">{PHONE_DISPLAY}</li>
              <li className="font-mono text-xs break-all">{EMAIL}</li>
            </ul>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[11px] tracking-[0.08em]">
          <span>© {new Date().getFullYear()} Sum Adventures (Pty) Ltd</span>
          <span className="[font-variant-numeric:tabular-nums]">
            Highest point reached · {formatElevation(summit.elevation)}
          </span>
        </div>
      </div>
    </footer>
  );
}
