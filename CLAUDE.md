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

The `<script type="application/ld+json">` block in `app/layout.tsx` is **not a
violation of this invariant** and must not be reported as one. The browser does
not parse or execute `ld+json` as script: it is an inert data block that ships
no runtime, creates no client boundary and hydrates nothing. `<script>` is
simply the only element schema.org permits for it. The invariant is about
shipped JavaScript, and this ships none.

**Do not install** `framer-motion`, `motion`, `gsap`, `lenis`,
`locomotive-scroll`, `react-spring`, or any scroll/animation library. A
smooth-scroll library was evaluated and rejected: it lerps a fake scroll
position, which breaks `position: sticky`, intersection observers and CSS scroll
timelines simultaneously.

### 2. Tailwind v4 is CSS-first

Tokens live in the `@theme` block in `app/globals.css`. **Do not create
`tailwind.config.js` or `tailwind.config.ts`.** Add new tokens to `@theme`.

### 3. The palette is split by contrast, and the splits are not cosmetic

Superseded the navy/icy-blue/orange ramp (`senqu`, `maloti`, `contour`,
`mahlasela`, `snowline`, `minowane`, `minowane-deep`) in Sprint 6C. Those token
names are gone; do not reintroduce them.

| Token | Hex | Use |
| --- | --- | --- |
| `teal` | `#219389` | Brand mark, large fills, type ≥24px, rail furniture |
| `teal-deep` | `#15665F` | 13px white text, links on white, borders |
| `teal-light` | `#4FBFB3` | Accents **on dark surfaces only** |
| `surface-dark` | `#072B28` | The default dark pairing; CTA fills on light |
| `ice` | `#EDF6F4` | Page background |
| `gold` | `#D9AA5E` | Prices, badges, fills — **on dark surfaces only** |
| `ink` | `#101418` | Body text; the only text colour allowed on gold |

**Provenance.** teal, gold and the wordmark grey were sampled from the client's
`SumAdv_icon.png` / `SumAdv_logo.png`. teal-deep, teal-light, surface-dark and
ice are *derived* from those samples to meet contrast. They are design
decisions, not client-supplied brand values. Do not alter any of them without
asking.

The rules that make the splits necessary, all measured:

- `teal` is 3.75 on white — fine for a 40px numeral, **fails AA at 13px.**
  Never use it as, or behind, small white text. Use `teal-deep` (6.78).
- `gold` is 7.12 on `surface-dark` but **2.13 on white and 1.94 on ice** — it
  fails every text threshold on a light background, including the 3.0 for
  large type. Gold is a dark-surface colour, full stop. Text on a gold fill is
  `ink` (8.69), never white (1.94).
- `teal-light` is 6.81 on `surface-dark` but **2.02 on ice** — it fails even
  the 3:1 non-text minimum on a light surface. Dark surfaces only, and a
  *mid*-teal gradient stop does not count as a dark surface (see Tsikoane).
- `surface-dark` on white is 15.16 and is the default dark pairing.
- Anything that has to sit over **both** tones — the altitude rail, chiefly —
  uses `teal`, the only value clearing 3:1 against both ice (3.41) and
  surface-dark (4.04).

`Station.tsx` picks its elevation figure from its `tone` prop for exactly this
reason: gold on dark, teal-deep on light. Do not collapse that into one value.

### 3b. Radius scale, and nothing is fully rounded

`--radius-sm: 8px` (inputs, badges, small chips) · `--radius-md: 12px` (cards,
images, controls nested inside a 16px container) · `--radius-lg: 16px`
(standalone buttons, the navbar pill).

**No `rounded-full`, no 999px, anywhere.** A control nested inside a
`radius-lg` container steps down to `radius-md` — that is why the masthead's
Enquire CTA is 12px inside the 16px pill.

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
  `CONTEXT === "production"`, naming the offending station. This is
  deliberately a hard failure, not a warning — a warning is exactly what let
  a stray dummy elevation ("3798m") sit unnoticed on the rail marker for
  four sprints.
- **The guard is a no-op today and that is its correct resting state.** It is
  not dead code. Sprint 7 confirmed it both ways against a real
  production-condition build: `CONTEXT=production npm run build` exits 0 as
  the data now stands, and exits 1 with the guard's own message when a station
  is flagged. Do not delete it because it currently passes.
- **The guard keys on `CONTEXT`, not `NEXT_PUBLIC_SITE_URL`. Do not
  change it back.** Sprint 5 keyed it on "`NEXT_PUBLIC_SITE_URL` is not
  localhost", which sounds equivalent and is not: every preview deploy has a
  non-localhost site URL, so the guard failed precisely the builds where the
  provisional value is *supposed* to be visible for review. As of Sprint 6a
  `NEXT_PUBLIC_SITE_URL` is a single canonical origin shared by all
  environments (invariant below), so it carries no information about which
  environment is building. `CONTEXT` is the only signal that distinguishes
  production from preview. Preview and local builds must keep rendering the
  provisional value — blocking them is the bug, not the feature.
- **`CONTEXT` is Netlify's build context and replaced `VERCEL_ENV` in
  Sprint 9.** This was not a rename. `VERCEL_ENV` is simply unset on Netlify,
  so between the platform move and Sprint 9 every guard in
  `lib/provisional.ts` returned false on every deploy and could not fire at
  all — while the build log looked clean. Netlify's values are `production`,
  `deploy-preview`, `branch-deploy` and `dev`; unset or `dev` is treated as
  local. If this project moves platform again, this is the first thing to
  change.
- **There is now an escape hatch, and it is a launch blocker.**
  `ALLOW_PROVISIONAL_DEPLOY=1` downgrades every guard from a build failure to
  a loud warning naming each offending field (Sprint 9). It fails closed —
  only the exact string `1` disarms it — and it exists for a throwaway
  preview, never for the client's domain. Deleting it from the Netlify
  environment before launch is a LAUNCH BLOCKING item in
  `docs/launch-checklist.md`, which lists all ten values it would publish.
  Do not reach for it to clear a build; the flag is not the problem the
  build is reporting.
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

They live in `data/passes.ts`, moved there from `Tsikoane.tsx` in Sprint 6K so
they could carry a build guard. **Two layers keep them off the page and both
must stay:** the render filter `passes.filter((p) => p.confirmed)` in
`components/sections/Tsikoane.tsx`, which is what actually stops them
rendering, and `assertNoProvisional` in `data/passes.ts` at scope
`any-deploy`, which aborts any deployed build while an unconfirmed pass
remains. The guard is a backstop against the filter being deleted; it is
deliberately a no-op on a local build. Do not set `confirmed: true` to clear a
build — that flag is the thing keeping the placeholder off the page.

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

**Sprint 9 put that framing on the page.** The Afriski day trip carries
`availability: SEASONAL_AVAILABILITY` — the exact string
`Seasonal · departure dates on enquiry`, separator U+00B7 — rendered next to
the price in the homepage card and on the tour detail panel. Previously the
"standing activity" decision existed only in this file and in
`docs/client-profile.md`, so a reader of the actual page had nothing to go on
and was free to assume the flyer date still stood.

Two things about `availability` that must not drift:

- **It is not a date field and must never become one.** No value can be
  parsed out of it and nothing branches on it. `status` remains the sole
  source of truth for bookability. It is a copy field, not a schedule.
- **Do not write a month range, season window or snow-condition claim into
  it.** The site does not know when the Afriski season opens or closes —
  that question is still outstanding with Mpho. "Dates on enquiry" is the
  honest answer and it is the one the client asked for.

This withdrew the scheduled 31 August 2026 status flip; see
`docs/launch-checklist.md`. A trip that says dates are agreed per enquiry
does not go stale on a calendar date.

Only the Afriski **day trip** carries the line. Sum Ultimate Afriski Weekend
never had a fixed date attached to it in any source, so nothing was replaced
there and no seasonality claim was invented for it. If the client says it is
seasonal too, add the same constant — do not infer it from the fact that
Afriski has snow.

There **is** JSON-LD on the site as of Sprint 6F — see invariant 1, which
explains why that block is not a client-component violation. It carries
**organisation data only**: a `TravelAgency` with a `Person` founder, a
`PostalAddress` and a `Country`. **No tour, `Product` or `Event` schema
exists**, so no tour data reaches structured data today.

If tour schema is ever added, filter past tours out of it — a
`Product`/`Event` listing a dead departure as bookable is worse than shipping
no schema at all.

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
plausible gets pasted into a Netlify environment variable, and
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

The scrim is **0.94 opacity over a deliberately narrow dark-teal ramp**
(`#0E4843 → #0B3A35 → surface-dark`), and both the opacity and the stops are
set by measured contrast, not taste. The repalette's first pass put a *mid*
teal at the top of that ramp and broke two things at once: the gold `<em>` in
the h2 fell to 2.68:1 (needs 3.0) and the teal-light mono gloss to 2.82:1
(needs 4.5) — because a mid-teal scrim is no longer a dark surface, which is
the only thing teal-light is specified for. At the shipped stops, worst case
per-pixel across the full parallax excursion: white h2 10.44, gold `<em>`
4.96, body 8.60, mono gloss 5.03, gold price 6.16 inside its panel.

If this section ever needs more of the photograph visible, re-measure; do not
solve it by lightening the stops or changing the type colour (invariant 3).

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
- `public/images/footprints-1.jpg` and `footprints-3.jpeg` are tracked and
  deliberately unreferenced — client-supplied, committed in Sprint 7 to be
  backed up, and reserved for the Gallery section in Phase 2. They are not
  dead assets; do not delete them.
- The brand assets moved out of `public/images/` in Sprint 6C, and `sum-icon.png`
  became `app/icon.png` (plus a 180×180 `app/apple-icon.png` resized from the
  same source) so the App Router emits the icon tags.
- **The two marks the site actually renders are AVIF, in `public/brand/`.**
  The masthead ships `public/brand/sum-logo.avif` (260×126, 9,489 B) and the
  footer ships `public/brand/sum-logo-dark.avif` (400×196, 14,033 B). Both are
  trimmed to their artwork — the untrimmed masters carry transparent padding,
  which is why the aspect ratios differ from their masters. Both call sites
  pass `unoptimized` on purpose; see the comment at each.
- `app/icon.png` was 800×800 (41 KB) until Sprint 6F — Next serves these
  files as-is and never resizes them, so a favicon slot was being paid for
  at full artwork resolution. It is now 32×32 (3.7 KB); `app/apple-icon.png`
  was already correct at 180×180 and was untouched. The resize was a pure
  downscale with alpha preserved: nothing was cropped, recoloured or
  redrawn, and it still must not be. `app/icon.png` is therefore no longer
  byte-identical to the supplied artwork — the untouched masters live at
  `public/brand/icon-source.png` (800×800) and
  `public/brand/apple-icon-source.png`. Re-cut from those, never from the
  32px file, and do not delete them.
- **Logo masters — unreferenced by design, do not delete.**
  `public/sum-logo.png` (800×416, 65,781 B) is the untrimmed master for
  `public/brand/sum-logo.avif`, and `public/brand/sum-logo-dark.png`
  (966×585, 100,508 B) is the untrimmed master for
  `public/brand/sum-logo-dark.avif`. Neither is referenced from code and
  neither should be — they are the re-cut sources, exactly as
  `brand/icon-source.png` is for the favicon. Re-cut from these, never from
  a shipped AVIF.
  (An earlier note here named `public/images/sumadv-icon.png` and
  `sumadv-logo.png`. Neither file exists in the repo; the note was stale and
  has been removed.)

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
- ~~**Knockout / reversed logo variant.**~~ **Supplied and landed, Sprint 6I.**
  The footer renders `public/brand/sum-logo-dark.avif` — client-supplied,
  transparent background, all four corners alpha 0, so it sits on
  `surface-dark` with no white plate. The text wordmark and the TODO it was
  waiting on are both gone. The standing rule survives the item: **do not
  invert, recolour, filter or knock out a mark as a stand-in** — a recoloured
  brand mark is an invented asset.
- Vector logo `.svg` — still outstanding. The masthead ships raster AVIF
  (`brand/sum-logo.avif`), not the PNG it once did.
- Confirmation that *minowane* is the customer-facing term
- Tagline conflict: logo says "Travel is adventure having fun", profile and all
  flyers say "More Than Just A Trip". Site uses the latter.
- Does the Afriski Winter Day Trip repeat, or was 25 July 2026 a one-off
  departure? Still unconfirmed by Mpho. **Lowered in consequence by Sprint 9,
  not resolved:** the page now says `Seasonal · departure dates on enquiry`,
  which is true under either answer, so the site no longer states anything
  that a "one-off" answer would falsify. The 31 August 2026 scheduled flip
  that used to hang off this question is withdrawn — see
  `docs/launch-checklist.md`. Confirming the answer is still worth doing; it
  is no longer holding anything up.
- When does the Afriski season close? **Unchanged and still open.** The
  seasonal line answers "when does it run?" with "ask us", which is honest
  and is what the client wanted, but it is not the answer. Do not invent a
  month range or season window in its place.

### Landed in Sprint 6C — previously "approved but never implemented"

All three items that sat in this section are now in the repo. Kept as a record
because these were mistaken for done more than once while they were not.

- **Palette.** ~~Blocked on three colour values.~~ **Supplied and landed.** The
  deep teal that passes AA at 13px white text (`teal-deep #15665F`), the dark
  surface replacing navy (`surface-dark #072B28`), and gold's role — it
  survives, but on dark surfaces only, and **not** as the CTA fill, which is
  `surface-dark`. Full token set and the contrast rules are in invariant 3.
- **Logo / masthead.** ~~Recolour to navy / icy-blue, approved Sprint 4.5,
  never touched.~~ **Superseded and landed.** That recolour never happened and
  is now moot: the direction reversed, and the site takes its palette *from*
  the client's teal mark rather than recolouring the mark to match the site.
  `Masthead.tsx` was rebuilt around the client's mark — at the time
  `public/sum-logo.png`, and since Sprint 6I the trimmed
  `public/brand/sum-logo.avif`.
- **Favicon.** ~~The site shipped none.~~ **Landed.** `app/icon.png` and
  `app/apple-icon.png` (180×180, resized from the same source). `icon.png`
  shipped at 800×800 originally and **is 32×32 (3,678 B) as of Sprint 6F** —
  see the resize note under Conventions, which is the authoritative
  description. The App Router emits `<link rel="icon">` and
  `<link rel="apple-touch-icon">`; verified served at `/icon.png` and
  `/apple-icon.png`. There is still no `manifest.json` — nothing needs one yet.

### Known gap — the altitude rail is one colour, not two

The brief for Sprint 6C asked for the rail to render `surface-dark` over light
sections and `teal-light` over dark ones. **It ships as a single `teal`
instead**, and that is a deliberate limitation, not an oversight.

The rail is one `position: fixed` element; sections scroll behind it. Nothing
in CSS tells it which section it currently overlaps, so a two-state swap needs
either a scroll listener (a client boundary — invariant 1) or a cross-fade rig
driven by the per-section view timelines. Worse, each half of the literal spec
fails on the opposite tone: `teal-deep` is 2.24 on `surface-dark`, and
`teal-light` is 2.02 on `ice`. `teal` is the one value clearing 3:1 against
both (3.41 on ice, 4.04 on surface-dark), so the rail is legible everywhere at
the cost of not changing. The elevation chips carry their own opaque fills, so
the digits were never at risk either way. Revisit only if the two-tone effect
is wanted for its own sake.
