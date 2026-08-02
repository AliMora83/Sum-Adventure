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

There is exactly **one `"use client"` in this repo**: `components/forms/
EnquiryForm.tsx`, landed in Sprint 4 and used only by `/contact`. That is the
sanctioned exception described at the end of this invariant. Every other
component is a server component and all motion is CSS scroll-driven, so the
animation bundle is 0 KB.

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

**Fenced exception — Tsikoane's provisional elevation. CLOSED in Sprint 7.**
Tsikoane is confirmed at **1,881 m**, supplied by Mpho. `data/stations.ts`
carries `elevation: 1881` with no `provisional` key, and the Tsikoane tour in
`data/tours.ts` carries `elevation: 1881` rather than `null`. Nothing on the
site renders "Elev. TBC" or a "prov." suffix for Tsikoane any more, and
production builds are **no longer blocked** by this.

The mechanism stays in place for the next figure that needs it, and the rules
below govern any future use of it:

- `provisional?: boolean` on `Station` — currently set on **no station**. It
  is a fenced exception, not a general-purpose flag; do not set it without a
  reason recorded here.
- Every place a provisional elevation renders (rail tick, rail marker pill,
  section eyebrow via `Station.tsx`'s `provisional` prop) must show a dashed
  pill border and a "prov." suffix. It must never look like a confirmed value.
  That rendering is still implemented and still correct — it is simply not
  reached while no station is flagged.
- Guarded in code, not just by convention: `data/stations.ts` throws at
  build/import time if any station is `provisional: true` while
  `VERCEL_ENV === "production"`, naming the offending station. This is
  deliberately a hard failure, not a warning — a warning is exactly what let
  a stray dummy elevation ("3798m") sit unnoticed on the rail marker for
  four sprints.
- **The guard is a no-op today and that is its correct resting state.** It is
  not dead code. Sprint 7 confirmed it both ways against a real
  production-condition build: `VERCEL_ENV=production npm run build` exits 0 as
  the data now stands, and exits 1 with the guard's own message when a station
  is flagged. Do not delete it because it currently passes.
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
- Consequence, and it is intended: **production builds fail while any station
  is provisional.** Production is meant to be blocked until the client
  supplies the real figure. If a production deploy is failing on this error,
  the fix is the client's number — not loosening the guard. This blocked
  production from Sprint 5 to Sprint 7 and is no longer in effect.
- When a real figure arrives, the only change should be the number and
  deleting the `provisional` flag — which is exactly how Sprint 7 closed
  this one. Never promote a provisional number to confirmed by deleting the
  flag alone, and never strip the flag without an actual client-supplied
  figure. The 2,600 m that stood here was not the answer; 1,881 m came from
  the client.

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

### 9. Never invent a config value — and label every stand-in

Invariant 5 covers the data layer: elevations, prices, tour names. This one
covers **config**: hostnames, domains, deploy aliases, env values, account
names, IDs, keys, paths to things that live outside this repo.

The rule, in two halves:

- **Any stand-in must be obviously fake.** Use reserved-for-testing values
  only — `example.invalid`, `example.com`, `example.test`. Never a value that
  could be mistaken for real config.
- **Declare it as a stand-in wherever it is reported.** This applies to
  anything that reaches a human — a report, a summary, a results table, a
  commit message — not only to what gets written to a file. An undeclared
  stand-in in a table of results is presented as a finding.

**Why, because the prohibition alone is easy to work around.** Config values
have a property data values don't: they are *copied*. A number that looks
plausible gets fact-checked by a customer and caught. A hostname that looks
plausible gets pasted into a Vercel environment variable, and
`NEXT_PUBLIC_SITE_URL` is the root of `metadataBase` — it becomes every
canonical link, every OG image URL and the `sitemap.xml` origin at once.
Nothing downstream validates it, because a well-formed URL is exactly what
that code expects. The site would come up looking entirely correct while
publishing a domain nobody owns.

The failure mode is specifically that *plausible* is worse than *wrong*.
`example.invalid` in a report is self-evidently a placeholder and survives
being skim-read; `sumadventures.co.ls` — right company, right TLD for
Lesotho — is indistinguishable from real config and does not.

This came from Sprint 6b. The production `robots.txt` branch cannot be
reached by a real build while Tsikoane is provisional (invariant 5), so it
was evaluated by passing a made-up production domain, and that domain was
then reported in a results table with no indication it was invented. The
value never touched a file — the defect was reporting it as though it were
configuration. See `docs/launch-checklist.md`.

Where a real value genuinely isn't known yet, that is a blocker to record,
not a gap to fill: leave it unset and say so.

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
Preserve the `z-10` on the ceiling element — without it the overhang layer
paints over the prints and the signature moment disappears.

The ceiling prints are **vector, and stay vector**. That was originally
because no plateau photography existed; as of Sprint 7 some does, and the
decision held anyway. `public/images/footprints-2.jpeg` — client-supplied,
real minowane — is now the section background, riding inside `.anim-overhang`
so it carries the inversion, with the section's existing gradient over it as
a scrim. Photograph behind the copy, drawing on the ceiling: both, not either.

The scrim opacity is **0.94 and is set by measured contrast, not by taste.**
The orange `<em>` in that h2 is the binding constraint — it measures 3.16:1
(desktop) / 3.20:1 (mobile) against the worst pixel the parallax can bring
behind it, against the 3.0 WCAG AA wants for large text. It fails at 0.90.
If this section ever needs more of the photograph visible, re-measure; do not
solve it by changing the type colour (see invariant 3).

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
- `public/images/footprints-1.jpg`, `footprints-3.jpeg`, `sum-icon.png` and
  `sum-logo.png` are tracked and deliberately unreferenced — client-supplied,
  committed in Sprint 7 to be backed up, and reserved for the Gallery section
  in Phase 2. They are not dead assets; do not delete them.

## Verification before any commit

```bash
npm run build      # must pass; catches server/client boundary errors
npm run lint
grep -rn "use client" app components lib data   # expect: nothing, or only the form
grep -rn "tailwind.config" .                    # expect: nothing
```

Confirm with me before: installing any dependency, deleting files, force-pushing,
or changing `data/stations.ts` elevation values.

## Outstanding

Engineering blockers — things that can only be verified on real
infrastructure — live in `docs/launch-checklist.md`. Nothing there may be
ticked off from a local build. Items waiting on the client are below.

### From the client

- ~~**Tsikoane confirmed elevation.**~~ **Supplied — 1,881 m, Sprint 7.** No
  longer a blocker on anything. It was previously the single dependency for
  three launch-checklist items; those items are still unverified, but they are
  now blocked solely on a connected deployment. See `docs/launch-checklist.md`.
- Names of five summit passes
- Tsikoane photography — **partly supplied.** Three cave/footprint images
  arrived and are committed (`footprints-1.jpg`, `footprints-2.jpeg`,
  `footprints-3.jpeg`); footprints-2 is the Tsikoane section background as of
  Sprint 7. Still outstanding: plateau summit, bonfire, Basotho meal.
- Mpho Noko portrait (initials placeholder in `Hlotse.tsx`)
- Vector logo `.svg` plus a white variant for dark backgrounds
- Confirmation that *minowane* is the customer-facing term
- Tagline conflict: logo says "Travel is adventure having fun", profile and all
  flyers say "More Than Just A Trip". Site uses the latter.
- Does the Afriski Winter Day Trip repeat, or was 25 July 2026 a one-off
  departure? The site currently presents it as a standing activity and that
  framing is unconfirmed. See `docs/client-profile.md` and the 31 August 2026
  scheduled flip in `docs/launch-checklist.md` — the answer decides whether
  that flip should happen at all.
- When does the Afriski season close?
- **Three colour values, blocking the repalette** (see below): the deep teal
  that passes AA at 13px white text, the dark surface replacement for navy,
  and whether gold survives as CTA fill.

### Approved but never implemented

Recorded here because "approved" has repeatedly been mistaken for "done" when
reading these docs. Nothing in this list is in the repo. None of it is in
scope for a sprint until it is picked up explicitly.

- **Logo / masthead recolour to navy / icy-blue.** Approved in Sprint 4.5.
  **UNLANDED.** `components/site/Masthead.tsx` has never been touched for it
  and still renders `/images/sumadv-icon.png` unmodified — the mark is still
  the client's original teal. No icon asset has been recoloured.
  `docs/client-profile.md` says the client "has approved a logo recolour";
  that is the approval, not the work.
- **Favicon.** **UNLANDED — the site ships no favicon at all.** There is no
  `app/icon.*`, no `app/apple-icon.*`, no `public/favicon.ico`, no web
  manifest, no `icons` key in the `metadata` export in `app/layout.tsx`, and
  no `<link rel="icon">` anywhere. Browsers currently fall back to a default.
- **Repalette.** **UNLANDED and blocked**, on the three colour values listed
  under "From the client" above. Not startable without them.
