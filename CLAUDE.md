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
- `data/stations.ts` holds the elevation spine with sources. Tsikoane plateau is
  deliberately `null` pending the client.
- Prices in `data/tours.ts` come from the client's own flyers. Do not adjust,
  round, or add tours that do not exist.
- Avoid unfalsifiable superlatives in copy ("higher than most countries on
  earth"). Prefer one checkable comparison.

### 6. Do not fabricate content

No placeholder testimonials presented as real, no invented tour names, no stock
imagery. Where an asset is missing, either use the existing labelled placeholder
pattern or leave a `TODO` — do not paper over the gap.

Five of the six Tsikoane summit passes have placeholder names. Only Linareng
Pass is confirmed. Leave the others as `name tbc`.

### 7. Secrets

`.env.local` only, never committed. `.env.example` documents required keys with
empty values. Do not print key values in terminal output or commit messages.

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
