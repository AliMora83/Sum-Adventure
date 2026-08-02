# Sum Adventures

Website for **Sum Adventures (Pty) Ltd** — a Lesotho-based tourism, photography
and events company operating out of Hlotse, Leribe.

> More Than Just A Trip

Next.js App Router · Tailwind CSS v4 · TypeScript · statically generated · one
client component (the enquiry form) and no client-side JavaScript anywhere else.

---

## Getting started

This is a complete project with a committed `package.json` and lockfile. Clone
and install — there is no scaffold-then-overlay step.

```bash
npm install
npm run dev
```

```bash
npm run build      # must pass before any commit
npm run lint
```

`NEXT_PUBLIC_SITE_URL` is required and the build fails without it — see
`.env.example` and `docs/launch-checklist.md`. Copy `.env.example` to
`.env.local` and set it to `http://localhost:3000` for local work.

Requires Next.js 16. Version 15 reaches end-of-support on 21 October 2026, and
the July 2026 release patched a denial-of-service affecting App Router apps with
Server Actions — which the Sprint 4 enquiry form will be.

## Images

Client photography goes in `public/images/`. Rename anything containing a space.

| File | Used by |
| --- | --- |
| `skii-1.jpg` | hero background, and the fallback OG image |
| `skii-3.jpg` | Afriski day trip card |
| `horse-riding.jpg` | Tsikoane card |
| `skii-5.jpg` | Afriski weekend card |
| `footprints-2.jpeg` | Tsikoane section background (Sprint 7) |
| `sumadv-icon.png` | masthead — included, white background knocked out |

Tracked but deliberately unreferenced, reserved for the Phase 2 gallery:
`footprints-1.jpg`, `footprints-3.jpeg`, `sum-icon.png`, `sum-logo.png`. They
are not dead assets — see CLAUDE.md before removing anything from
`public/images/`.

The Tsikoane section takes a photographic background as of Sprint 7, but the
cave-ceiling footprints over it are still vector — see below.

---

## Design direction: "Altitude"

Lesotho is the only country entirely above 1,400 m. The homepage is organised by
real elevation, ascending, and the section order is determined by geography
rather than marketing convention.

The signature element is a **route profile** down the left edge: an elevation
profile rotated 90°, where rightward deviation means higher. It reads as a
journey, which is what makes ascending-while-scrolling-down legible instead of
confusing.

**Every number on the site must survive a customer fact-checking it.** Vague
superlatives are the weak point, not the elevations. Where a figure is
unverified it renders as `Elev. TBC` rather than an estimate — that mechanism
is `formatElevation()` and it is still live, though as of Sprint 7 no station
reaches it.

Elevations are in `data/stations.ts`. They are not individually source-
annotated in the file; provenance lives in the sprint docs and in the commit
that introduced each figure. Tsikoane's 1,881 m was supplied by the client in
Sprint 7 and replaced a provisional 2,600 m.

### The Tsikoane inversion

At Tsikoane the dinosaur footprints — *minowane* in Sesotho — are pressed into
the **ceiling** of the Menoaneng caves, not the floor. You climb roughly a
kilometre up, then look up. That section is the only place on the site where the
parallax reverses: the background travels downward as you scroll down, so the
overhang reads as receding above you.

The footprints on the ceiling are vector. That began as a stopgap — no
Tsikoane photography existed — but the decision was made deliberately when
photography did arrive in Sprint 7: the photograph sits *behind* the copy as
the section background, and the drawing stays on the ceiling. Both, not either.

The background scrim over that photo is at 0.94 opacity because that is what
the orange heading needs to clear WCAG AA (3.16:1) against the worst pixel the
parallax can bring behind it. It is a measured value — re-measure before
changing it, and don't fix a contrast failure there by recolouring the type.

---

## Architecture

**One `"use client"`, in `components/forms/EnquiryForm.tsx`.** It is scoped to
the form component alone — never a page, never a layout — and is used only by
`/contact`. Every other component is a server component. All motion is CSS
scroll-driven animation, so the animation bundle is 0 KB.

This is not purism. Mobile data in Lesotho costs roughly 2.5% of average monthly
income, and 4G coverage is around 86% against near-universal 3G. Bundle size is
an affordability question here, not a vanity metric. A smooth-scroll library was
considered and rejected: it lerps a fake scroll position, which breaks
`position: sticky`, intersection observers and CSS scroll timelines, and it would
have forced a client boundary around the whole page.

**Tokens live in CSS.** Tailwind v4 is CSS-first; the `@theme` block in
`app/globals.css` replaces `tailwind.config.js`.

**Two orange values, deliberately.** `minowane` for large numerals and badges.
`minowane-deep` for any fill behind small white text — the lighter orange
measures about 3.5:1 against white and fails WCAG AA at 13px. The `Button`
component only ever uses the deep value.

**Motion degrades to nothing.** The finished state is authored as the default;
animation layers on inside `@supports (animation-timeline: scroll())`. Firefox
stable, where scroll-driven animations remain behind a flag, renders a complete
static page. `prefers-reduced-motion` removes all of it.

### Layout

```
app/
  globals.css          token system + motion layer
  layout.tsx           fonts, root metadata, masthead, footer, mobile bar
  robots.ts            environment-aware; allows crawling in production only
  sitemap.ts           generated off metadataBase
  (rail)/              route group carrying the altitude rail
    layout.tsx
    page.tsx           homepage — section order is the altitude spine
    about/page.tsx
    tours/page.tsx     live tours, plus a past section that self-hides
    tours/[slug]/page.tsx
  contact/
    page.tsx           the one route with a client component
    actions.ts         server action; Resend
components/
  site/                masthead, altitude rail, footer, mobile bar
  ui/                  button, station chip, contour layers, tour badge
  sections/            hero, hlotse, tsikoane, tour grid
  forms/EnquiryForm.tsx   the only "use client" in the repo
data/
  stations.ts          the elevation spine + rail geometry + provisional guard
  tours.ts             real products, priced off client flyers
lib/
  fonts.ts             Archivo (wdth axis) + IBM Plex Mono
  site.ts              canonical origin, metadata builders
  whatsapp.ts          deep links with per-tour prefilled messages
docs/
  client-profile.md    the only sanctioned source for company copy
  launch-checklist.md  engineering blockers; nothing ticked from a local build
  sprint-3.md, sprint-6c.md, claude-code-prompts.md
```

---

## Outstanding from the client

CLAUDE.md holds the authoritative list. In brief:

- [x] Tsikoane plateau elevation — **supplied, 1,881 m, Sprint 7**
- [ ] Names of the five unconfirmed summit passes
- [ ] Tsikoane shot list — cave/footprint images supplied; plateau summit,
      bonfire and Basotho meal still outstanding
- [ ] Mpho Noko portrait (initials placeholder in `Hlotse.tsx`)
- [ ] Vector logo `.svg` plus a white variant for dark backgrounds
- [ ] Three colour values needed before the repalette can start
- [ ] Confirm *minowane* is the term he uses with customers
- [ ] Resolve the tagline conflict: the logo reads "Travel is adventure having
      fun", the profile and all flyers read "More Than Just A Trip". The site
      uses the latter.

## Approved but not implemented

Not in the repo, despite being agreed. See CLAUDE.md for detail.

- Logo / masthead recolour to navy / icy-blue (approved Sprint 4.5) — the mark
  is still teal and `Masthead.tsx` is untouched.
- Favicon — the site ships none: no `app/icon.*`, no `favicon.ico`, no
  manifest, no `icons` metadata, no icon link tags.
- Repalette — blocked on the three colour values above.

## Roadmap

| Sprint | Scope | Status |
| --- | --- | --- |
| 1 | Discovery, scope, phasing | Done |
| 2 | Sitemap, homepage mockup, design direction | Done |
| 3 | Scaffold, tokens, shell, data layer, homepage | Done |
| 4 | Enquiry form (Resend), `/tours/[slug]`, About, Contact | Done |
| 5 | Data-driven rail, provisional elevation + guard | Done |
| 6 | Metadata, sitemap, robots, X-Robots-Tag, past-tour handling | Done |
| 7 | Confirmed elevation, client images, docs reconciliation | Done |
| — | Vercel setup + first production deploy | Parked, see below |

Deferred to phase 2: blog, events, gallery, standalone destinations,
testimonials page, photography portfolio, tour calendar, downloadable
itineraries, CMS.

**Deployment is parked until next week by decision, not oversight.** Nothing
in this repo has ever been deployed, no preview URL is recorded anywhere, and
three launch-checklist items cannot be verified until that changes. See
`docs/launch-checklist.md`.

## Notes

Booking is **enquiry-based only**. There is no payment processing anywhere in
this project. WhatsApp is the primary conversion path and will likely outperform
the form for this audience.

Domain, hosting and email are the client's own accounts.
