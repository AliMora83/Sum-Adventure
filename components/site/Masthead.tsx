import Link from "next/link";
import Image from "next/image";

/**
 * No Contact entry. The Enquire button beside this row already routes to
 * /contact, and two links to the same page in one pill is redundant. The
 * button is now the only masthead route to that page — if it is ever
 * restyled into something that opens WhatsApp or an external URL instead,
 * put Contact back here first.
 */
const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#tsikoane", label: "Tsikoane" },
  { href: "/tours", label: "Tours" },
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
 * WIDTH — 70vw at lg and up, centred in the VIEWPORT. Deliberately measured
 * against the screen and nothing else: not the 1180px content column, not the
 * hero copy block's gutter, not `--spacing-rail`. The pill's left edge does
 * not line up with the headline, and it is not inset to clear the altitude
 * rail — the rail is `fixed left-0 w-rail` and simply passes underneath the
 * pill's left end. That overlap is accepted, and it is why neither element
 * offsets for the other: the rail's position is a function of the left screen
 * edge, the pill's of the screen centre, and they are independent by design.
 *
 * This replaces an earlier rail-derived inset (`pl-[calc(var(--spacing-rail)
 * + 20px)]`, matching the content column exactly). Don't reinstate it —
 * floating the pill free of the content grid is the point.
 *
 * Below lg the previous behaviour is unchanged: the rail isn't rendered at
 * all there, and the pill stays near-full width inside the plain page gutter.
 */
export function Masthead() {
  return (
    <header className="fixed inset-x-0 top-3 z-[60] sm:top-4">
      <div className="mx-auto w-full max-w-[1180px] px-3 sm:px-5 lg:w-[70vw] lg:max-w-none lg:px-0">
        <div className="flex h-[58px] items-center justify-between gap-4 rounded-lg border border-[rgba(7,43,40,0.08)] bg-white pl-4 pr-3 shadow-[0_4px_24px_rgba(7,43,40,0.10)] md:h-[68px] md:pl-6 md:pr-4">
          {/*
            ==== NAV LOGO SIZE — TUNE HERE ====
            `w-[96px] md:w-[118px]` is the only thing to change. Height is
            derived (h-auto), so the aspect ratio cannot be distorted by
            editing one number.

            There is a ceiling, and it is close. The asset is trimmed to its
            artwork, aspect 2.064, and the pill height is fixed at 58px /
            68px. Sprint 6i took this to 130px, which renders 63.0px tall in
            the 68px pill — 2.5px of clearance top and bottom, tight enough
            that the mark read as jammed against the pill rather than set
            inside it. At 118px it renders 57.2px tall, giving 5.4px per
            side. Going much past 130px means growing the pill, which Sprint
            6i explicitly ruled out. Mobile is unchanged at 96px (46.5px
            tall in the 58px pill, 5.7px of clearance) — the two sides were
            already close and 118px brings desktop into line with it.

            Source is the trimmed AVIF in public/brand/, not the raw PNG:
            the original carried 33px of transparent padding down one side,
            which is why the old 85px render looked smaller than its box.
          */}
          <Link href="/" className="flex shrink-0 items-center" aria-label="Sum Adventures — home">
            <Image
              src="/brand/sum-logo.avif"
              alt="Sum Adventures"
              width={260}
              height={126}
              priority
              className="h-auto w-[96px] md:w-[118px]"
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
