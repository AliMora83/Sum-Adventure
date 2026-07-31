# CLAUDE.md

Project instructions for Claude Code. Read before editing anything.

## What this is

Marketing site for **Sum Adventures (Pty) Ltd**, a Lesotho tourism, photography
and events company. Enquiry-based bookings only — there is **no payment
processing anywhere in this project**, and none should be added.

Next.js 16 App Router · Tailwind CSS v4 · TypeScript · statically generated.

---

## Hard invariants

Breaking any of these is a defect, not a style choice. If a task seems to
require breaking one, stop and ask.

### 1. No client components without justification

There is currently **no `"use client"` anywhere** in this repo. Every component
is a server component and all motion is CSS scroll-driven, so the animation
bundle is 0 KB.

This is a cost decision, not purism. Mobile data in Lesotho runs around 2.5% of
average monthly income and 4G coverage is ~86% against near-universal 3G. Bundle
size is an affordability question for the actual audience.

The enquiry form is the one place a client boundary is justified, and it must be
scoped to the form component alone — never the page, never a layout.

**Do not install** `framer-motion`, `motion`, `gsap`, `lenis`,
`locomotive-scroll`, `react-spring`, or any scroll/animation library. A
smooth-scroll library was evaluated and rejected: it lerps a fake scroll
position, which breaks `position: sticky`, intersection observers and CSS scroll
timelines simultaneously.

### 2. Tailwind v4 is CSS-first

Tokens live in the `@theme` block in `app/globals.css`. **Do not create
`tailwind.config.js` or `tailwind.config.ts`.** Add new tokens to `@theme`.

### 3. Two orange values, and they are not interchangeable

| Token | Use |
| --- | --- |
| `minowane` | Large numerals, prices, badges, the rail marker |
| `minowane-deep` | Any fill sitting behind small white text |

`minowane` measures about 3.5:1 against white — fine for a 40px price, fails
WCAG AA at 13px. The `Button` component only ever uses `minowane-deep`. Do not
"simplify" these into one value.

### 4. Motion is a progressive enhancement

The finished state is authored as the CSS default. Animation layers on inside
`@supports (animation-timeline: scroll())` and is removed by
`prefers-reduced-motion`. Firefox stable — where scroll-driven animations are
still behind a flag — must render a complete, correct, static page.

When adding motion: animate `transform` and `opacity` only. Never animate
`width`, `height`, `margin`, or `top`/`left`.

### 5. Never invent a number

The design's structural device is real elevation data. Every figure on the site
must survive a customer fact-checking it.

- Unverified elevations render as `Elev. TBC` via `formatElevation()`. Do not
  substitute an estimate, a rounded guess, or a value scraped from an
  unattributed source.
- `data/stations.ts` holds the elevation spine with sources.
- Prices in `data/tours.ts` come from the client's own flyers. Do not adjust,
  round, or add tours that do not exist.
- Avoid unfalsifiable superlatives in copy ("higher than most countries on
  earth"). Prefer one checkable comparison.

**Fenced exception — Tsikoane's provisional elevation.** Tsikoane's real
elevation is still unconfirmed, but `data/stations.ts` carries
`elevation: 2600, provisional: true` for it (Sprint 5) rather than `null`, so
the altitude rail draws correctly during design work. This is a deliberate,
temporary breach of the rule above, not a reversal of it:

- `provisional?: boolean` on `Station` — set on Tsikoane only, never on any
  other station.
- Every place a provisional elevation renders (rail tick, rail marker pill,
  section eyebrow via `Station.tsx`'s `provisional` prop) must show a dashed
  pill border and a "prov." suffix. It must never look like a confirmed value.
- Guarded in code, not just by convention: `data/stations.ts` throws at
  build/import time if any station is `provisional: true` while
  `VERCEL_ENV === "production"`, naming the offending station. This is
  deliberately a hard failure, not a warning — a warning is exactly what let
  a stray dummy elevation ("3798m") sit unnoticed on the rail marker for
  four sprints.
- **The guard keys on `VERCEL_ENV`, not `NEXT_PUBLIC_SITE_URL`. Do not
  change it back.** Sprint 5 keyed it on "`NEXT_PUBLIC_SITE_URL` is not
  localhost", which sounds equivalent and is not: every preview deploy has a
  non-localhost site URL, so the guard failed precisely the builds where the
  provisional value is *supposed* to be visible for review. As of Sprint 6a
  `NEXT_PUBLIC_SITE_URL` is a single canonical origin shared by all
  environments (invariant below), so it carries no information about which
  environment is building. `VERCEL_ENV` is the only signal that distinguishes
  production from preview. Preview and local builds must keep rendering the
  provisional value — blocking them is the bug, not the feature.
- Consequence, and it is intended: **production builds fail while Tsikoane is
  provisional.** Production is meant to be blocked until the client supplies
  the real figure. If a production deploy is failing on this error, the fix is
  the client's number — not loosening the guard.
- When the client supplies the real figure, the only change should be the
  number and deleting the `provisional` flag. Do not quietly promote 2,600 m
  to a confirmed value, and do not strip the flag without an actual
  client-supplied figure.

### 6. Do not fabricate content

No placeholder testimonials presented as real, no invented tour names, no stock
imagery. Where an asset is missing, either use the existing labelled placeholder
pattern or leave a `TODO` — do not paper over the gap.

Five of the six Tsikoane summit passes have placeholder names. Only Linareng
Pass is confirmed. Leave the others as `name tbc`.

### 7. Secrets

`.env.local` only, never committed. `.env.example` documents required keys with
empty values. Do not print key values in terminal output or commit messages.

### 8. Past tours are never bookable

`data/tours.ts` tours carry `status: "upcoming" | "past"`. A past tour must
never render a price as a call-to-action, an Enquire button, or a WhatsApp
booking link — see `components/ui/TourBadge.tsx` for the badge logic. The
homepage featured grid excludes past tours entirely; `/tours` lists them in a
separate section below the live tours (that section simply doesn't render
when no tour is past). The `/tours/[slug]` route still generates for past
slugs so a link shared from the original flyer resolves instead of 404ing.

Afriski Winter Day Trip was marked `past` in Sprint 4.5 (its flyer date had
lapsed) and restored to `upcoming` in Sprint 5.5 — the client wants it
presented as a standing, always-available activity with dates agreed per
enquiry, not tied to the one flyer date. There is no date field on `Tour` and
none should be added back for this reason: nothing about a tour's
bookability should be inferred from a date. `status` is set explicitly per
tour and only flips to `past` on the client's actual instruction.

There is currently no JSON-LD or other structured data on the site. If any is
added later, filter past tours out of it — a `Product`/`Event` schema listing
a dead departure as bookable is worse than shipping no schema at all.

---

## Design direction: "Altitude"

Lesotho is the only country entirely above 1,400 m. Homepage section order is
determined by real elevation, ascending — geography, not marketing convention.

The signature element is the **route profile** rail down the left edge
(`components/site/AltitudeRail.tsx`): an elevation profile rotated 90°, where
rightward deviation means higher. It reads as a journey, which is what makes
ascending-while-scrolling-down legible. The marker rides the path via
`offset-path`, not a faked vertical translate. Desktop only; on mobile it
collapses to `ScrollProgress` plus the per-section altitude chips.

**The Tsikoane inversion.** The dinosaur footprints — *minowane* in Sesotho —
are pressed into the **ceiling** of the Menoaneng caves. That section is the
only place the parallax reverses, so the overhang reads as receding above you.
The prints are vector because no plateau photography exists. Preserve the
`z-10` on the ceiling element — without it the overhang layer paints over the
prints and the signature moment disappears.

### Typography

Two families. `Archivo` carries display and body — display is the same family at
`wdth 125 / wght 900`, which is why the `wdth` axis is loaded. `IBM Plex Mono`
carries every number, with `tabular-nums` so digits don't jitter.

Do not add a third family. A brush script was in the client's flyers and was
deliberately cut — handwriting fights the cartographic register.

---

## Conventions

- Server components by default. `async` where data is needed.
- Path alias `@/*` maps to the repo root.
- Data lives in `data/*.ts` as typed exports, not JSON, so types are checked.
- WhatsApp links always go through `lib/whatsapp.ts` helpers so every CTA
  carries a prefilled message naming the specific tour.
- Prices formatted via `formatPrice()`, elevations via `formatElevation()`.
- Copy is sentence case in body, uppercase only via the `.type-display` and
  station-chip classes.
- British/South African English: "kilometre", "colour", "organised".
- `docs/client-profile.md` is the single sanctioned source for company copy
  (mission, values, founder bio, service lines, etc). If it's not in that
  file, it hasn't been supplied — don't invent it.
- `.anim-parallax`/`alt-settle` in `app/globals.css` are unused. That's a
  current decision, not an oversight — leave them in place and don't flag or
  clean them up.

## Verification before any commit

```bash
npm run build      # must pass; catches server/client boundary errors
npm run lint
grep -rn "use client" app components lib data   # expect: nothing, or only the form
grep -rn "tailwind.config" .                    # expect: nothing
```

Confirm with me before: installing any dependency, deleting files, force-pushing,
or changing `data/stations.ts` elevation values.

## Outstanding from the client

- Tsikoane plateau elevation (one `null` in `data/stations.ts`)
- Names of five summit passes
- Tsikoane photography: plateau summit, cave ceiling, bonfire, Basotho meal
- Mpho Noko portrait (initials placeholder in `Hlotse.tsx`)
- Vector logo `.svg` plus a white variant for dark backgrounds
- Confirmation that *minowane* is the customer-facing term
- Tagline conflict: logo says "Travel is adventure having fun", profile and all
  flyers say "More Than Just A Trip". Site uses the latter.
