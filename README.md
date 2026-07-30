# Sum Adventures

Website for **Sum Adventures (Pty) Ltd** — a Lesotho-based tourism, photography
and events company operating out of Hlotse, Leribe.

> More Than Just A Trip

Next.js App Router · Tailwind CSS v4 · TypeScript · statically generated · zero
client-side JavaScript.

---

## Getting started

The repo holds application source only — no `package.json`, since the toolchain
version should come from the generator rather than be pinned by hand. Scaffold
first, then overlay this repo:

```bash
npx create-next-app@latest sum-adventures \
  --typescript --eslint --app --tailwind \
  --no-src-dir --import-alias "@/*"

cd sum-adventures
npm install next@^16.2.12          # 16.2.12 carries the July 2026 security patches
```

Copy this repo's contents over the generated project, overwriting
`app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `next.config.ts`,
`tsconfig.json` and `postcss.config.mjs`.

```bash
npm run dev
```

Requires Next.js 16. Version 15 reaches end-of-support on 21 October 2026, and
the July 2026 release patched a denial-of-service affecting App Router apps with
Server Actions — which the Sprint 4 enquiry form will be.

## Images

Client photography goes in `public/images/`. Rename anything containing a space.

| File | Used by |
| --- | --- |
| `skii-1.jpg` | hero background |
| `skii-3.jpg` | Afriski day trip card |
| `horse-riding.jpg` | Tsikoane card |
| `skii-5.jpg` | Afriski weekend card |
| `sumadv-icon.png` | masthead — included, white background knocked out |

The Tsikoane section has no photo slot. It is drawn, not photographic — see below.

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
unverified it renders as `Elev. TBC` rather than an estimate.

Verified elevations are in `data/stations.ts` with sources noted.

### The Tsikoane inversion

At Tsikoane the dinosaur footprints — *minowane* in Sesotho — are pressed into
the **ceiling** of the Menoaneng caves, not the floor. You climb roughly a
kilometre up, then look up. That section is the only place on the site where the
parallax reverses: the background travels downward as you scroll down, so the
overhang reads as receding above you.

No Tsikoane photography exists yet, so the footprints are vector. This is a
feature, not a stopgap — when photography arrives, decide deliberately whether
it replaces the drawing or sits behind it.

---

## Architecture

**No `"use client"` anywhere.** Every component is a server component. All
motion is CSS scroll-driven animation, so the animation bundle is 0 KB.

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
  globals.css        token system + motion layer
  layout.tsx         fonts, masthead, rail, footer, mobile bar
  page.tsx           homepage — section order is the altitude spine
components/
  site/              masthead, altitude rail, footer, mobile bar
  ui/                button, station chip, contour layers
  sections/          hero, hlotse, tsikoane, tour grid
data/
  stations.ts        the elevation spine + rail geometry
  tours.ts           real products, priced off client flyers
lib/
  fonts.ts           Archivo (wdth axis) + IBM Plex Mono
  whatsapp.ts        deep links with per-tour prefilled messages
docs/
  sprint-3.md
```

---

## Outstanding from the client

- [ ] Tsikoane plateau elevation — one `null` in `data/stations.ts`
- [ ] Names of the five unconfirmed summit passes
- [ ] Tsikoane shot list: plateau summit, cave ceiling, bonfire, Basotho meal
- [ ] Mpho Noko portrait (initials placeholder in `Hlotse.tsx`)
- [ ] Vector logo `.svg` plus a white variant for dark backgrounds
- [ ] Confirm *minowane* is the term he uses with customers
- [ ] Resolve the tagline conflict: the logo reads "Travel is adventure having
      fun", the profile and all flyers read "More Than Just A Trip". The site
      uses the latter.

## Roadmap

| Sprint | Scope | Status |
| --- | --- | --- |
| 1 | Discovery, scope, phasing | Done |
| 2 | Sitemap, homepage mockup, design direction | Done |
| 3 | Scaffold, tokens, shell, data layer, homepage | Done |
| 4 | Enquiry form (Resend), `/tours/[slug]`, About, Contact | Next |
| 5 | SEO, metadata per route, sitemap, OG images | |
| 6 | Performance pass, QA on real devices, launch | |

Deferred to phase 2: blog, events, gallery, standalone destinations,
testimonials page, photography portfolio, tour calendar, downloadable
itineraries, CMS.

## Notes

Booking is **enquiry-based only**. There is no payment processing anywhere in
this project. WhatsApp is the primary conversion path and will likely outperform
the form for this audience.

Domain, hosting and email are the client's own accounts.
