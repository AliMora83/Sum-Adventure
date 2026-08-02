import Link from "next/link";
import Image from "next/image";

const nav = [
  { href: "/about", label: "About" },
  { href: "/#tsikoane", label: "Tsikoane" },
  { href: "/tours", label: "Tours" },
  { href: "/contact", label: "Contact" },
];

/**
 * Floating pill masthead. Server component, zero JS.
 *
 * Opaque white at every scroll position — there is deliberately no
 * scroll-driven colour or opacity change, because that needs a scroll
 * listener and a client boundary (invariant 1), and because a pill that
 * changes state mid-scroll reads as a bug on a page whose whole motion
 * language is the altitude rail.
 *
 * The border and the shadow are load-bearing, not decoration: the hero
 * behind this is a bright snow photograph, and a borderless white pill on
 * near-white snow has no visible edge at all. The hero also carries a
 * top-down scrim (see Hero.tsx) so the separation holds across whatever
 * imagery ends up there.
 *
 * POSITIONING — `fixed`, not `sticky`, and the difference matters here.
 * A `sticky top-*` element renders at its *flow* position until the scroll
 * passes it, so as the first child of <body> it would sit flush against the
 * viewport top at rest, only acquire its offset after scrolling, and push
 * the hero down by its own height. This pill has to float clear of the top
 * edge from the first frame and overlay the hero. `fixed` gives exactly the
 * described behaviour; both are equally zero-JS.
 *
 * WIDTH — derived from the rail, never hardcoded. The altitude rail is
 * `fixed left-0 w-rail` and appears at lg. Its label pills overhang the
 * 132px track slightly, so the content column is inset by rail + 20px, and
 * this pill takes the identical inset. That puts the pill's left edge exactly
 * on the content column's left edge and guarantees the rail passes OUTSIDE it
 * at every width — below lg the rail isn't rendered at all, so the pill falls
 * back to the plain page gutter. Change `--spacing-rail` and this follows it.
 */
export function Masthead() {
  return (
    <header className="fixed inset-x-0 top-3 z-[60] sm:top-4">
      <div className="mx-auto max-w-[1180px] px-3 sm:px-5 lg:pl-[calc(var(--spacing-rail)+20px)] lg:pr-5">
        <div className="flex h-[58px] items-center justify-between gap-4 rounded-lg border border-[rgba(7,43,40,0.08)] bg-white pl-4 pr-3 shadow-[0_4px_24px_rgba(7,43,40,0.10)] md:h-[68px] md:pl-6 md:pr-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Sum Adventures — home">
            <Image
              src="/sum-logo.png"
              alt="Sum Adventures"
              width={793}
              height={412}
              priority
              className="h-8 w-auto md:h-11"
            />
          </Link>

          {/* Desktop only. On mobile the bottom sticky bar already carries
              WhatsApp and Tours, so there is nothing for a hamburger to open. */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-2 text-[12.5px] uppercase tracking-[0.1em] text-teal-deep transition-colors duration-200 hover:bg-[rgba(7,43,40,0.05)] [font-variation-settings:'wdth'_100,'wght'_600]"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* surface-dark, not gold: gold on white is 2.13 for the label, and
              it would also miss the 3:1 non-text minimum that the button's own
              edge needs against the white pill. radius-md — one step down from
              the pill's radius-lg, because it is nested inside it. */}
          <Link
            href="/contact"
            className="hidden shrink-0 rounded-md bg-surface-dark px-5 py-3 text-[11.5px] uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-teal-deep md:inline-flex [font-variation-settings:'wdth'_100,'wght'_700]"
          >
            Enquire
          </Link>
        </div>
      </div>
    </header>
  );
}
