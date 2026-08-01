# Sprint 6c

## 1. Consolidate the past-tour predicate

Commit `cc4f174` — "Sprint 6c (1/4): route every past-tour test through isPastTour()".
Parent `8e02647`. Branch `staging`, pushed to `origin/staging`.

`isPastTour()` landed in Sprint 6b (`feb73c0`) but only `TourBadge` consumed it.
Five inline `status === "past"` tests across four sites now route through the
predicate:

| Site | Was | Now |
| --- | --- | --- |
| `app/(rail)/tours/page.tsx:24` | `t.status !== "past"` | `!isPastTour(t)` |
| `app/(rail)/tours/page.tsx:25` | `t.status === "past"` | `isPastTour(t)` |
| `components/sections/TourGrid.tsx:12` | `t.status !== "past"` | `!isPastTour(t)` |
| `app/(rail)/tours/[slug]/page.tsx:71` | `tour.flagship \|\| tour.status === "past"` | `tour.flagship \|\| isPastTour(tour)` |
| `app/(rail)/tours/[slug]/page.tsx:96` | `tour.status === "past" ? …` | `isPastTour(tour) ? …` |

Semantics checked at each site before editing. The two negated sites are not a
widening: `Tour.status` is the closed union `"upcoming" | "past"`, so `!== "past"`
and `!isPastTour()` cannot diverge. No signature change, no new export.

Only `data/tours.ts:103`, inside the predicate itself, still tests the string.

Build: `npm run build` pass (Next.js 16.2.12, 11/11 static pages).
Lint: `npm run lint` exit 0.
`grep -rn "use client"` — only `components/forms/EnquiryForm.tsx` (the sanctioned
exception). `grep -rn "tailwind.config"` — prose references only, no config file.

## 2. Dry run of the past-tour path against real data

**Not committed.** `data/tours.ts` was flipped locally (Afriski
`status: "upcoming"` → `"past"`, one line), built, served, curled, then reverted
with `git checkout -- data/tours.ts`. Verified byte-identical afterwards: blob
`fbde8868f8d02e61d93b9e46334cf97b1f1ca10f` before and after, matching
`HEAD:data/tours.ts`.

Build with the flip: pass, 11/11 static pages, `/tours/afriski-winter-day-trip`
generated. Served with `npm start`; all three routes HTTP 200.

### Homepage — Afriski absent

Zero occurrences of `Afriski Winter Day Trip`, the slug `afriski-winter-day-trip`,
or its image `skii-3.jpg`. Zero `Past trip` badges: the tour is excluded, not
shown as past. Grid renders two `<article>` elements —
`Tsikoane Plateau Camping` and `Sum Ultimate Afriski Weekend`.

Layout at two cards, measured live in the DOM at a 1280px viewport:

```
gridTemplateColumns: 317.328px 317.336px 317.336px   gap: 24px
card 1  Tsikoane Plateau Camping        317 × 556   left 202
card 2  Sum Ultimate Afriski Weekend    317 × 556   left 543
```

Cards keep their natural track width, equal heights, no stretch or overflow. The
third column is simply empty, so the row is left-aligned rather than centred.
Not broken; worth a design decision if a two-card state becomes normal.

### /tours — past section only

`Afriski Winter Day Trip` does not appear above the `Past trips` heading. Live
grid: 2 articles. Past section: 1 article.

```html
<h2 class="type-display text-2xl text-senqu">Past trips</h2>
<p …>These have already run. Ask us if there’s a next date.</p>
```

Past card, full visible text:

```
Past trip  3 222 m · Mahlasela Pass  Afriski Winter Day Trip
Snow in Lesotho, and back the same day. Transport and entry included, departing Maputsoe.
Ran for R900 pp   R1,100 with bum boarding   Ask when this runs again →
```

Inside that card's markup: `wa.me` 0, `Enquire` 0, `target="_blank"` 0, and none
of the live-card price treatment (`type-data text-xl text-minowane-deep`, the
`From` label). Exactly two anchors — the card wrapper to
`/tours/afriski-winter-day-trip`, and the soft CTA to
`/contact?tour=afriski-winter-day-trip`. The price renders as prose
(`Ran for R900 pp`, muted `#5B6C90` mono 12.5px), not as a CTA.

The three `wa.me` links elsewhere on `/tours` belong to the two live tours and
the site-wide "plan a trip" CTA. None references the past tour.

Open question: `priceNote` renders on the past card as `R1,100 with bum boarding`
with no past framing of its own. It is not a CTA and not a link, so invariant 8
is not breached, but it is a live-sounding price sitting under a dead trip.

### /tours/afriski-winter-day-trip — route generates, booking suppressed

Route still generates; HTTP 200; `<title>Afriski Winter Day Trip — Sum Adventures</title>`.

Within `<main>`: `wa.me` 0, `Enquire` 0, `whatsapp` 0, `target="_blank"` 0.
Anchors inside `<main>` are `/tours` and `/contact?tour=afriski-winter-day-trip`
only. Price panel reads:

```
Ran for R900 | per person · 1 day | R1,100 with bum boarding
This trip has already run. | Ask when it’s back
```

`Enquire on WhatsApp` and `Use the enquiry form` are both absent, as is the
`text-minowane-deep` price treatment.

**Caveat on "no wa.me in the page source".** The page source does contain one
`wa.me` link, and four `Enquire` strings. All are site chrome outside `<main>`:
the `MobileBar` fixed bottom bar (`sm:hidden`) carries the generic site-wide
"plan a trip" WhatsApp link, and the masthead button plus footer nav link both
say `Enquire` and point at `/contact`, not WhatsApp. None is tour-specific and
none carries the past tour's name. The invariant-8 requirement holds; the
literal "no wa.me anywhere in the source" check does not.

### TourBadge — two sites, not three

The `Past trip` label renders at 2 of the 4 `TourBadge` call sites:

| Call site | Renders `Past trip`? |
| --- | --- |
| `app/(rail)/tours/page.tsx:124` (past section) | yes |
| `app/(rail)/tours/[slug]/page.tsx:66` (detail hero) | yes |
| `app/(rail)/tours/page.tsx:54` (live grid) | no — past tours filtered out |
| `components/sections/TourGrid.tsx:37` (homepage) | no — past tours filtered out |

It cannot reach three. The two grids that do not show it exclude past tours by
construction, which is invariant 8 working as intended.

### Meta description

Rendered string, `/tours/afriski-winter-day-trip`:

```
Past trip — this has already run. Snow in Lesotho, and back the same day. Transport and entry included, departing Maputsoe.
```

**123 characters** — the fixture prediction of 123 was exact, both as raw source
bytes and as the decoded string (the em dash is a literal UTF-8 character, not an
entity, so the two counts agree).

The status prefix is characters 0–32 (33 chars including the trailing space), so
it survives truncation at 155 with room to spare — the whole string does, since
123 < 155. It also survives a 120-char cut. `og:description` and
`twitter:description` carry the identical string.

### JSON-LD / structured data

**Nothing is emitted.** Across all three pages: zero `application/ld+json`
scripts, zero `@context`/`@type`, zero `schema.org`, zero microdata
(`itemscope`/`itemprop`), zero RDFa (`typeof=`), zero `offers`, zero
`availability`, zero `priceCurrency`. No structured-data source exists in
`app`, `components`, `lib` or `data`.

CLAUDE.md invariant 8 does address this: it states there is currently no JSON-LD,
and that if any is added, past tours must be filtered out of it. The first half
holds. The second half is not yet engaged — there is nothing to filter.

What the past tour does emit is plain Open Graph: `og:type` is `website` (not
`product`), and no price, offer or availability field appears in any meta tag.
So no machine-readable "bookable" signal is published for a dead trip today. If
a `Product`/`Event` schema is ever added, this is the case it has to exclude.

Absolute URLs in this dry run resolved against the local `NEXT_PUBLIC_SITE_URL`,
so `og:url` rendered as a `localhost:3000` origin. That is the local environment
value and says nothing about production configuration.
