# Sum Adventures — Sprint 3

Next.js App Router · Tailwind v4 · zero client-side JavaScript.

## Install

```bash
npx create-next-app@latest sum-adventures --typescript --eslint --app --tailwind --src-dir=false --import-alias "@/*"
cd sum-adventures
```

Then copy this folder's contents over the generated project, overwriting
`app/globals.css`, `app/layout.tsx`, `app/page.tsx` and `postcss.config.mjs`.

```bash
npm run dev
```

## Images

Drop the Supplied Images into `public/images/`. Rename anything with a
space — `horse riding.jpg` must become `horse-riding.jpg`.

| File | Used by |
|---|---|
| `skii-1.jpg` | hero |
| `skii-3.jpg` | Afriski day trip card |
| `horse-riding.jpg` | Tsikoane card |
| `skii-5.jpg` | Afriski weekend card |
| `sumadv-icon.png` | masthead (already included, white knocked out) |

Tsikoane's section has no photo slot on purpose — it's drawn.

## Architecture notes

**No `"use client"` anywhere.** Every component is a server component.
All motion is CSS scroll-driven animation, so the animation bundle is
0 KB. This is deliberate: mobile data in Lesotho costs roughly 2.5% of
monthly income, so bundle size is an affordability question, not a
vanity metric.

**Tokens live in CSS, not a config file.** Tailwind v4 is CSS-first;
`app/globals.css` `@theme` block replaces `tailwind.config.js`.

**Two orange values.** `minowane` for large numerals and badges.
`minowane-deep` for any fill sitting behind small white text — the
lighter orange measures ~3.5:1 against white and fails AA at 13px.
The `Button` component only ever uses the deep value.

**Motion degrades to nothing.** Finished state is the default;
animations layer on inside `@supports (animation-timeline: scroll())`.
Firefox stable renders a complete static page. `prefers-reduced-motion`
removes everything.

## Outstanding from the client

- [ ] Tsikoane plateau elevation — currently renders "Elev. TBC" from a
      single value in `data/stations.ts`
- [ ] Names of the five unconfirmed summit passes
- [ ] Tsikoane shot list: plateau summit, cave ceiling, bonfire, meal
- [ ] Mpho Noko portrait (initials placeholder in `Hlotse.tsx`)
- [ ] Vector logo (.svg) plus a white variant for dark backgrounds
- [ ] Confirm "minowane" is the term he uses with customers

## Not in this sprint

Enquiry form + Resend, tour detail routes, About/Contact pages, SEO
metadata per route, sitemap. Sprints 4-6.
