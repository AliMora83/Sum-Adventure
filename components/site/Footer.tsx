import Link from "next/link";
import Image from "next/image";
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
              The reversed logo variant the previous TODO was waiting on.
              Client-supplied, transparent background — verified: all four
              corners are alpha 0, so it sits on surface-dark directly with
              no white plate.

              Legibility on #072b28, measured rather than assumed: the gold
              wordmark is 6.72:1 and the grey tagline 9.83:1. The teal — the
              pin body and "Adventures" — is the dimmest element at 3.12:1.
              That still clears the 3:1 graphical-object threshold, and
              logotypes are exempt from contrast requirements under 1.4.11
              anyway. Nothing disappears.

              ==== FOOTER LOGO SIZE — TUNE HERE ====
              `w-[200px]`. Height derives from it. The asset is trimmed and
              served at 2x (400px) for retina.

              `unoptimized` IS DELIBERATE — do not remove it as an oversight.
              This asset is already AVIF, already trimmed, and already at
              exactly the 2x dimensions it is displayed at, so /_next/image has
              nothing left to do but re-encode it. Measured in Sprint 6j: the
              optimiser re-encodes at q=75 and returns a LARGER file than the
              committed source (14,033 B source -> 19,210 B served). Bypassing
              it serves the source bytes verbatim.

              Scope: this exemption is for pre-sized flat vector brand artwork
              only. Photography stays on the optimiser, where responsive widths
              and format negotiation are doing real work — see the hero and the
              tour grid, which must not get this prop.
            */}
            <Image
              src="/brand/sum-logo-dark.avif"
              alt="Sum Adventures"
              width={400}
              height={196}
              unoptimized
              className="h-auto w-[200px]"
            />
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
            {/*
              `inline-block py-1 -my-1` on each link is a hit-area fix, not a
              layout change. The anchors were 16px tall, under the 24px
              minimum in WCAG 2.2 SC 2.5.8. The padding grows the target to
              24px; the equal negative margin pulls the extra height back out
              of the flow, so the rendered spacing between links is
              byte-identical to before. Type size, colour and rhythm are
              untouched — only the clickable box grew.
            */}
            <ul className="space-y-2 text-sm">
              <li><Link href="/tours" className="inline-block py-1 -my-1 hover:text-gold">Tours &amp; packages</Link></li>
              <li><Link href="/#tsikoane" className="inline-block py-1 -my-1 hover:text-gold">Tsikoane experience</Link></li>
              <li><Link href="/about" className="inline-block py-1 -my-1 hover:text-gold">About</Link></li>
              <li><Link href="/contact" className="inline-block py-1 -my-1 hover:text-gold">Enquire</Link></li>
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
