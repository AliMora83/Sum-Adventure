# Launch checklist — engineering blockers

Things that must be verified **on real infrastructure** before the client's
domain goes live. This file is for blockers we own. Items waiting on the
client live under "Outstanding from the client" in `CLAUDE.md`.

Do not tick anything here from a local build, a code reading, or a direct
evaluation of a function. An item is verified when it has been observed on
the deploy it describes.

---

## Vercel setup and deployment are PARKED until next week

**By decision, not oversight.** Recorded here so nobody re-derives it as an
open task or treats the unverified items below as newly discovered.

The consequence is that **no deployment of this project exists**. Not
production, not preview, not staging. Nothing in this repo has ever been
built by Vercel or served from anywhere other than localhost.

**No preview URL, deploy alias or hostname is recorded anywhere in this
repo, and none may be invented to stand in for one.** Until a real
deployment exists there is nothing to curl, and nothing here may be checked
against real infrastructure. A plausible-looking hostname is worse than an
absent one — see CLAUDE.md invariant 9, which exists because exactly that
happened in Sprint 6b. If a hostname is genuinely needed to illustrate
something, it must be a reserved-for-testing value (`example.invalid`) and
declared as a stand-in wherever it is reported, including in a summary or a
results table.

`NEXT_PUBLIC_SITE_URL` is set to `http://localhost:3000` in local `.env.local`
and is unset everywhere else, because there is nowhere else yet.

---

## Unverified — must be checked on the first real production build

All three items in this section were previously blocked on the Tsikoane
elevation. **That dependency is gone** — the client confirmed 1,881 m in
Sprint 7, the `provisional` flag is deleted and `VERCEL_ENV=production`
builds now succeed (verified locally: exit 0, and still exit 1 when a station
is flagged).

**They are now blocked solely on a connected deployment**, which is parked
per the section above. Nothing about the code changed and nothing became more
verified; the reason they cannot be checked simply moved from "the build
aborts" to "there is nowhere to check them".

### Production `robots.txt` has never been emitted by a build

**Status: UNVERIFIED. Do not mark verified before a real production deploy.**
**Blocked on: a connected deployment.**

`app/robots.ts` returns `allow: /` plus a sitemap reference when
`VERCEL_ENV === "production"`, and `disallow: /` otherwise.

The `disallow` branch is genuinely verified — curled over HTTP from
`next start` in Sprint 6b, returning `User-Agent: *` / `Disallow: /`.

The production branch is **not**. No production `robots.txt` has ever been
generated. Until Sprint 7 that was because the provisional-elevation guard in
`data/stations.ts` aborted every `VERCEL_ENV=production` build; that guard now
passes, and the reason is simply that no deployment exists to build it. The
only evaluation of that branch ever made called the function directly, outside
Next, **with a fabricated production hostname** — see invariant 9. Neither a
real origin nor Next's own route rendering was involved, and that evaluation
remains worthless as verification.

What that leaves unproven, specifically:

- that a production build emits `robots.txt` at all
- that the sitemap URL in it resolves against the real `NEXT_PUBLIC_SITE_URL`
- that `allow: /` is what actually ships, rather than the `disallow` branch
  reached via a `VERCEL_ENV` that is unset or unexpected in the real
  production environment

On the first production build, fetch `/robots.txt` from the live origin and
confirm the body allows crawling and names the correct sitemap URL. Confirm
`/sitemap.xml` lists that same origin. Until then this stays unverified even
though the code is believed correct.

### `X-Robots-Tag` in production

**Status: UNVERIFIED. Blocked on: a connected deployment.**

Same shape, same caveat. `next.config.ts` drops the `noindex` header only when
`VERCEL_ENV === "production"`. The header's presence on non-production was
curled and confirmed in Sprint 6a; its **absence** in production has never
been observed on a real deploy. Check response headers on the live origin —
a stray `X-Robots-Tag: noindex` in production would deindex the entire site
silently.

---

## Standing manual steps — no automation will catch these

### A tour goes past only when someone sets the flag by hand

**There is no date filtering anywhere in this project, by design.** `Tour` has
no date field, nothing computes "has this departure lapsed", and no scheduled
job flips anything. A tour becomes past when a human edits
`status: "upcoming"` to `status: "past"` in `data/tours.ts` — and only then.

That is deliberate (CLAUDE.md invariant 8): the Afriski Winter Day Trip was
marked past in Sprint 4.5 because its flyer date had lapsed, and the client
then asked for it back as a standing, always-available activity with dates
agreed per enquiry. Inferring bookability from a date got the wrong answer for
a real product, so the inference was removed rather than fixed.

**The cost of that decision is that the manual step has no reminder attached.**
Nothing prompts anyone, nothing warns when a departure date has passed,
nothing fails a build. If a tour genuinely ends and nobody edits the file, the
site keeps presenting it as bookable — with a live price, an Enquire button
and a WhatsApp booking link — indefinitely. The failure is silent and it is
customer-facing.

Two consequences worth knowing:

- The past-tour render path is **verified locally against real data, and
  never rendered in production.** Both halves of that sentence are the
  status; neither cancels the other.

  On 1 August 2026 (Sprint 6c) `data/tours.ts` was flipped locally to put
  Afriski at `status: "past"`, built, served with `npm start` and curled.
  That run covered: homepage exclusion, the `/tours` live/past partition,
  CTA suppression on the detail route, the `Past trip` badge and the metadata
  description. The data change was reverted and never committed. Details in
  `docs/sprint-6c.md`. (That sprint's notes list "structured data" among the
  things covered. At the time of that run — 1 August 2026 — there was none in
  the repo, so there was genuinely nothing to cover. **JSON-LD landed
  afterwards, in Sprint 6F**, and it carries organisation data only: no tour,
  `Product` or `Event` schema exists, so no tour status reaches structured
  data and the 6c run's conclusion is unaffected. CLAUDE.md invariant 8 is the
  standing instruction if tour schema is ever added.)

  A local run does not make it production-verified. No tour carries
  `status: "past"` in committed data, and **blocked on: a connected
  deployment** — until Sprint 7 this was blocked on the provisional guard as
  well, and that half is now cleared. It stays locally-verified only until a
  real past tour is observed on a live origin.
- Only the client can authorise the flip. Do not set it from a lapsed flyer
  date — that is the exact inference Sprint 5.5 reversed.

**The scheduled flip.** Afriski Winter Day Trip is flipped to
`status: "past"` on 31 August 2026. Owner: Ali. This is a single dated
action, not a recurring review. It requires a repo edit and a redeploy, so
it cannot be delegated to Mpho.

Scheduling it **assigns** the control; it does not **add** one. Everything
above still holds — there is no date field, no date filtering, no job, no
prompt, no warning and no build failure. Nothing in the codebase knows about
31 August 2026. If the date passes and nobody makes the edit, the site keeps
presenting the tour as bookable, exactly as described above. The date is a
calendar commitment held by a person, and that person is the only mechanism.

## Required configuration

### `NEXT_PUBLIC_SITE_URL` must be set per environment

The build **fails** without it (`lib/site.ts`), deliberately — an unset value
used to mean silently emitting relative OG paths no scraper can resolve.

Set it in the Vercel project per environment, each to that environment's own
stable origin: the client's domain for production, the deploy's own alias for
preview/staging. Never to a per-deployment URL, and never to a guessed or
placeholder hostname — this value is the root of `metadataBase`, so it becomes
every canonical link, every OG image URL and the `sitemap.xml` origin at once.
Nothing downstream validates it.

Currently set only in local `.env.local`, to `http://localhost:3000`. The real
values do not exist yet and must not be guessed; this is a blocker to record,
not a gap to fill.

### ~~Production is blocked while Tsikoane is provisional~~ — CLEARED, Sprint 7

The client supplied the Tsikoane plateau elevation (1,881 m) and the
`provisional` flag was deleted, so the guard in `data/stations.ts` no longer
aborts production builds. Confirmed against a real production-condition
build rather than by reading the code: `VERCEL_ENV=production npm run build`
exits 0 as the data now stands, and still exits 1 with the guard's own error
when a station is deliberately flagged.

The guard itself stays in place as a no-op — that is its correct resting
state, not dead code. See CLAUDE.md invariant 5.

**This does not verify anything above.** It removes one of two blockers. The
three unverified items are now waiting on a connected deployment, which is
parked — see the top of this file.

---

## Blocked on client assets

### Hero scrim must be re-sampled against Mpho's photography — BLOCKING

**Status: BLOCKING for launch. Blocked on: the real hero photograph.**

The hero H1 currently measures **4.41:1** worst case, with the scrim's `via`
stop at **surface-dark/55** (`components/sections/Hero.tsx`). Both figures are
recorded here so the comparison can actually be made later.

**That 4.41 is a property of the current placeholder photograph, not of the
scrim.** It is the worst pixel in `public/images/skii-1.jpg` under the 55%
stop. A different photograph with a brighter region behind the headline will
produce a different number at the identical scrim value, and nothing in the
build will notice — this is exactly the failure Sprint 6i found at the old 30%
stop, where the headline measured 2.43:1 and passed only because that photo's
bright area happened to fall away from where the headline sits.

When Mpho's photography lands and the hero image is swapped, re-sample before
launch:

- measure the H1 against the **worst** pixel of the new image in the headline's
  actual footprint, not an average and not a convenient region
- compare against the recorded 4.41:1 at 55%
- if the new figure drops below the threshold, raise the scrim stop until it
  clears — do not change the type colour (CLAUDE.md invariant 3)

Swapping the hero image without re-sampling is the defect this item exists to
prevent.

### ~~Image codec policy for flat vector artwork~~ — RESOLVED, Sprint 6k

**Outcome: AVIF retained for both brand marks. The optimiser is bypassed
instead.** `CLAUDE.md` is unamended — the AVIF-first invariant stands as
written and was never the problem.

The Sprint 6i D5 benchmark (400px: PNG8 5,829 B vs AVIF 12,677 B) compared two
things that are not comparable, on a pipeline that discards the comparison:

- **Not like for like.** libvips collapses any palette request of ≤128 colours
  to a 16-entry, 4-bit palette, so the 5,829 B file was a **16-colour** image,
  not a faithful one. Re-measured at the marks' own dimensions: a faithful
  256-colour PNG8 is *larger* than AVIF (1.31× nav, 1.46× footer), and PNG24 is
  4.0–4.7×. The 16-colour file is genuinely small and shows no banding — there
  are no gradients in this artwork to band, the pin, sun and mountains are flat
  fills — but it costs the tagline, which degrades by mean Δ10/255 across a
  third to a half of its pixels at render size. Alpha survives palette
  conversion cleanly in every variant.
- **Source bytes were never the shipped bytes.** Both marks went through
  `/_next/image`, which re-encodes to AVIF regardless of source format. The
  source container never reached a browser, so a source-file comparison could
  not have decided anything.

The real finding was in that second point: the optimiser's q=75 re-encode was
returning **larger** files than the committed sources, which are already AVIF,
already trimmed and already at their 2× display dimensions. Sprint 6k added
`unoptimized` to both marks — nav 12,435 B → 9,489 B, footer 19,210 B →
14,033 B, **8,123 B saved** — and both now serve byte-identical to source, at
unchanged dimensions, with CLS 0 and slightly better fidelity than before.

The exemption is scoped to those two call sites. Photography stays on the
optimiser; do not generalise this.

### Five Tsikoane summit pass names outstanding from Mpho — NOT a launch blocker

**Status: content gap. Does not block launch.**

Five of the six passes (`02`–`06`) are placeholders in `data/passes.ts` —
`"Pass two"`…`"Pass six"`, each `confirmed: false`. Only `01 Linareng Pass` is
confirmed. See "Outstanding from the client" in `CLAUDE.md`.

**They cannot reach the page.** As of Sprint 6k they are double-guarded:

1. `Tsikoane.tsx` filters to `confirmed` passes at render, so only Linareng is
   emitted. Verified against build output — the placeholder strings appear only
   in a server-only SSR chunk, never in a client bundle, prerendered HTML or an
   RSC payload.
2. `data/passes.ts` calls `assertNoProvisional` at scope `any-deploy`, so any
   build with `VERCEL_ENV` set to anything but `development` aborts while an
   unconfirmed pass remains. Verified by building, not by reading: preview
   exits 1 naming all five.

The section already tells the reader the count is six and that five names are
to come, so nothing on the page is wrong or misleading in the meantime — it is
simply less complete than it will be. **Chase the names, but do not hold
launch for them**, and do not set `confirmed: true` to clear a build: that flag
is what keeps the placeholder off the page.

---

# RECONCILIATION — 8 August 2026 (Sprint 6L)

Verification pass over Sprints 6c–6k. **Everything below is OPEN and recorded
only** — Sprint 6L fixed nothing by design. Fixes are a later sprint's work.

Findings are transcribed as measured. Where a sprint brief's expectation and
the codebase disagree, both are stated; "DIVERGED" means the two differ, not
necessarily that the code is wrong.

## D1 — Sprint 6c–6k feature verification

| Item | Expected | Actual | Verdict |
| --- | --- | --- | --- |
| Palette tokens | teal `#15665F`, surface `#072B28`, gold `#D9AA5E` | all three present; `#15665F` is `--color-teal-deep`, `--color-teal` is `#219389` | VERIFIED (naming) |
| Radius scale | `--radius-lg` 16px buttons, 12px cards | 8/12/16 in `@theme`; `Button.tsx` `rounded-lg`, cards `rounded-md`; no `rounded-full` or 999px anywhere | VERIFIED |
| Masthead width/logo | 70vw, centred, `fixed`, 118px / 96px | 70vw ✓, centred ✓, `fixed` ✓, 118/96 ✓ | VERIFIED (see 6M note) |
| `app/(rail)/` group | rail structurally absent from /contact | `AltitudeRail` mounted only in `(rail)/page.tsx`; absent from /contact markup | VERIFIED |
| Nav links | HOME first, no CONTACT | `Masthead.tsx:11-16` — Home, About, Tsikoane, Tours | VERIFIED |
| Elevation eyebrows | absent from non-home pages | `<Station>` only in Hlotse/TourGrid/Tsikoane (all homepage) | VERIFIED |
| JSON-LD + guard | scaffold + non-localhost guard | `app/layout.tsx:83`; `data/organization.ts` guard scope `any-deploy` | VERIFIED |
| Favicon wiring | present | `app/icon.png` 32×32 (3,678 B), `app/apple-icon.png` 180×180 (15,859 B) | VERIFIED |
| Footer logo | AVIF, wordmark removed | `/brand/sum-logo-dark.avif`; no display-type wordmark | VERIFIED |
| Placeholder colour | `#5F7671` | `EnquiryForm.tsx:44` | VERIFIED |
| Input font size | 16px | `text-base` | VERIFIED |
| Hero scrim | 55% | `via-surface-dark/55` (`Hero.tsx:30`) | VERIFIED |
| Footer link targets | 28px | measured 28.0px on all four; li pitch 28px | VERIFIED |
| Input border | `teal-deep/70` | `EnquiryForm.tsx:44` | VERIFIED |
| `unoptimized` scope | both marks, nowhere else | exactly 2 call sites (Masthead, Footer); 6 photographic sites untouched | VERIFIED |
| Pass guard | `assertNoProvisional` + render filter | `data/passes.ts` (`any-deploy`) + filter at `Tsikoane.tsx:159` | VERIFIED |
| Tsikoane elevation | 1,881 m, no provisional flag | `data/stations.ts:35`; no station flagged | VERIFIED |
| Afriski Winter Day Trip | `status: "upcoming"`, no date field | `status: "upcoming"` (`data/tours.ts:41`); no date field on `Tour` ✓ | VERIFIED (see 6M note) |

**The two DIVERGED rows above were both stale expectations, not defects.**
Reclassified in Sprint 6M and recorded here as expected behaviour, so that no
future session "fixes" either one.

1. **The masthead is `position: fixed`, and that is CORRECT** —
   `components/site/Masthead.tsx:59`. **Do not change it to `sticky`.** As the
   first child of `<body>`, a `sticky` element renders at its *flow* position
   until the scroll passes it: it would sit flush to the viewport top at rest,
   only acquire its offset after scrolling, and push the hero down by its own
   height instead of floating over it. The pill has to clear the top edge from
   the first frame and overlay the hero, which is exactly what `fixed` does.
   Both are equally zero-JS. The reasoning is also in the file's own comment;
   the 6L brief's expectation of "sticky" was the stale part.
2. **Afriski Winter Day Trip at `status: "upcoming"` is CORRECT** —
   `data/tours.ts:41`. It matches CLAUDE.md invariant 8 and
   `docs/client-profile.md:125-131`: marked `past` in Sprint 4.5, restored to
   `upcoming` in Sprint 5.5 on the client's own instruction, because they want
   it presented as a standing activity with dates agreed per enquiry. Do not
   flip it back without the client saying so.

   **Consequence worth carrying forward: no tour in committed data carries
   `status: "past"`.** The past-tour render path is therefore unexercised in
   committed state — it was verified by a local, reverted data flip in Sprint
   6c (see the standing-manual-steps section above) and has never rendered
   from committed data. The 31 August 2026 Afriski flip is the first time it
   will.

## D2 — Documentation reconciliation

`docs/Client-ToDo.md` **does not exist** and could not be reconciled.

Stale or false claims found:

| File | Line | Claim | Reality |
| --- | --- | --- | --- |
| `CLAUDE.md` | 211 | "There is currently no JSON-LD or other structured data on the site" | **FALSE.** JSON-LD landed Sprint 6f; emitted at `app/layout.tsx:83`. Also self-contradictory — invariant 1 discusses that same block at length. |
| `docs/launch-checklist.md` | 130 | "there is no JSON-LD or other structured data in this repo" | **FALSE**, same reason. |
| `CLAUDE.md` | 329 | "`public/sum-logo.png` is the masthead logo" | **FALSE.** Masthead uses `/brand/sum-logo.avif`. `public/sum-logo.png` (65,781 B) is referenced nowhere. |
| `CLAUDE.md` | 407 | "`Masthead.tsx` was rebuilt around `public/sum-logo.png`" | Stale — same reason. |
| `CLAUDE.md` | 382 | "the masthead currently ships the raster PNG" | Stale — ships AVIF. |
| `CLAUDE.md` | 342 | names `public/images/sumadv-icon.png` and `sumadv-logo.png` | **Neither file exists.** |
| `CLAUDE.md` | 375–379 | knockout/reversed variant "expected this week, and the footer is waiting on it"; footer "renders the wordmark SUM ADVENTURES in white display type and no mark, with a TODO" | **FALSE.** The variant landed in Sprint 6i; the footer renders `/brand/sum-logo-dark.avif` and there is no TODO. |
| `CLAUDE.md` | 408 | "Favicon … `app/icon.png` (800×800, the supplied artwork unmodified)" | **FALSE**, and contradicted by lines 332–334 of the same file. Actual: 32×32, 3,678 B. |
| `CLAUDE.md` | invariant 6 | describes the pass placeholders without naming their location | Stale — they moved to `data/passes.ts` in Sprint 6k and gained a build guard. |

**Invariants tested against the codebase — one is false today.** Invariants 1,
2, 3, 3b, 4, 5, 7 and 9 all hold as written. Invariant 8 holds except for its
closing sentence about structured data (row 1 above).

Invariant 1's wording is **correct as it stands** and was specifically
re-checked: it states there is exactly one `"use client"`, names
`EnquiryForm.tsx` as the sanctioned exception, and explicitly exempts the
`ld+json` block. It does not say zero client components. Verified against the
tree: `use client` appears in `EnquiryForm.tsx` only.

## D3 — UNVERIFIED items

Both remain **UNVERIFIED and unverifiable locally.** No deployment of this
project exists; no real hostname is recorded anywhere in this repo, and none is
invented here. Where a hostname is needed below it is `example.invalid`, a
reserved non-resolving TLD, **and it is a stand-in, not configuration.**

**Production `robots.txt`.** `app/robots.ts:26` branches on
`VERCEL_ENV === "production"`. Locally the non-production branch is confirmed:
`GET /robots.txt` off `next start` returns `User-Agent: *` / `Disallow: /`. The
production branch cannot be reached locally in any meaningful sense — setting
`VERCEL_ENV=production` by hand exercises the branch but resolves the sitemap
against `NEXT_PUBLIC_SITE_URL`, which is `http://localhost:3000` here, so the
output would assert a localhost sitemap and prove nothing about production. To
verify: deploy to production, `curl https://<real-domain>/robots.txt`, confirm
`Allow: /` and that the `Sitemap:` line names the real origin, then confirm
`/sitemap.xml` lists that same origin. Requires a real deployed hostname.

**Absence of `X-Robots-Tag` in production.** `next.config.ts:36` returns no
headers when `VERCEL_ENV === "production"`. Presence on non-production is
confirmed locally — `curl -D -` off `next start` shows `X-Robots-Tag: noindex`.
**Absence cannot be verified locally at all**: a local build has `VERCEL_ENV`
unset, which is the non-production branch by definition. To verify: `curl -I`
the live production origin and confirm no `X-Robots-Tag` is present on an HTML
response. Requires a real deployed hostname. This is the higher-risk of the
two — a stray `noindex` in production deindexes the entire site silently.

## D4 — Orphans and dead paths

**a) Unreferenced files in `public/`** (referenced = named in `app/`,
`components/`, `lib/` or `data/`; a mention in a sprint doc does not count).

*Deliberately retained, documented in CLAUDE.md — not orphans:*

| File | Bytes |
| --- | --- |
| `public/images/footprints-1.jpg` | 400,487 |
| `public/images/footprints-3.jpeg` | 242,477 |
| `public/brand/icon-source.png` | 41,205 |
| `public/brand/apple-icon-source.png` | 15,859 |
| **Subtotal** | **700,028** |

*Master alongside its AVIF, but undocumented:*

| File | Bytes |
| --- | --- |
| `public/brand/sum-logo-dark.png` | 100,508 |

*Genuine orphans — no code reference, no documented reason:*

| File | Bytes |
| --- | --- |
| `public/images/horse-1.jpg` | 140,811 |
| `public/images/mount-4.jpg` | 129,724 |
| `public/images/mount-2.jpg` | 126,353 |
| `public/images/skii-7.jpg` | 116,926 |
| `public/images/mount-3.jpg` | 104,644 |
| `public/images/skii-6.jpg` | 72,763 |
| `public/sum-logo.png` | 65,781 |
| `public/images/mount-1.jpg` | 59,869 |
| `public/images/skii-4.jpg` | 59,119 |
| `public/images/dessert-1.jpg` | 45,268 |
| `public/images/skii-2.jpg` | 28,311 |
| **Subtotal** | **949,569 (927.3 KiB)** |

These ship in the repo but not to browsers — `public/` is served on demand, so
this is repo weight, not page weight.

**b) Exports with no external call site.** Six, all consumed inside their own
module. Surplus `export` keywords, **not dead code**: `OrgField` and
`organizationJsonLd` (`data/organization.ts`), `SummitPass`
(`data/passes.ts`), `GuardScope` and `isGuardedDeploy` (`lib/provisional.ts`),
`WHATSAPP_NUMBER` (`lib/whatsapp.ts`).

**c) `app/(rail)/layout.tsx` is a vestigial passthrough.** It renders
`<>{children}</>` and nothing else; the route-group name no longer describes
what it does, since the rail moved into `(rail)/page.tsx`. The file says so
itself and says removal needs sign-off because it means moving files. Recorded,
not touched.

**`.anim-parallax` / `alt-settle`: both present and retained by decision.**
`app/globals.css:198` and `:252`, unused in markup, with the explaining note at
`CLAUDE.md:321`. **These are not dead code and are not flagged as such.**

## D5 — Build and route health

Clean `rm -rf .next && npm run build`: **passes, no warnings.** Next.js 16.2.12
(Turbopack), TypeScript clean, 13/13 static pages. `npm run lint` clean.
`use client` appears in `components/forms/EnquiryForm.tsx` **only**.

Turbopack does not print per-route JS, so this was measured off a production
`next start`, per route, as compressed transfer:

| Route | HTML | JS chunks | First-load JS (enc / dec) | CSS |
| --- | --- | --- | --- | --- |
| `/` | 15,145 B | 7 | 153,644 / 534,855 B | 8,671 B |
| `/about` | 6,980 B | 7 | 153,644 / 534,855 B | 8,671 B |
| `/tours` | 7,458 B | 7 | 153,644 / 534,855 B | 8,671 B |
| `/tours/[slug]` | 7,229 B | 7 | 153,644 / 534,855 B | 8,671 B |
| `/contact` | 9,329 B | 8 | 156,110 / 541,466 B | 8,671 B |

`/contact` carries one extra chunk, **+2,466 B compressed** — the measured cost
of the single sanctioned client boundary.

**Total page weight for `/` — 803,120 B (784.3 KiB) compressed**, 18 assets,
all 7 images loaded, measured at 1280×900 @DPR2 off a production server:

| Category | Bytes | Share |
| --- | --- | --- |
| Images | 515,452 | 64.2% |
| JavaScript | 153,644 | 19.1% |
| Fonts | 110,208 | 13.7% |
| HTML | 15,145 | 1.9% |
| CSS | 8,671 | 1.1% |
| **Total** | **803,120** | |

Uncompressed that is 1,294,147 B. The figure is viewport-dependent: at DPR2 the
hero and Tsikoane images resolve to their `w=1920` candidates (96,385 B and
198,201 B), which is 37% of the page on their own. **Imagery, not JavaScript,
is what this page costs.**

## Open items from this pass

Raised OPEN in Sprint 6L. Statuses updated in Sprint 6M — **6L itself fixed
nothing, by design.** Two remain open and both need the same thing.

1. **CLOSED (6M).** CLAUDE.md:211 and launch-checklist:130 — the "no JSON-LD"
   claim. Both corrected: JSON-LD exists as of Sprint 6F and carries
   organisation data only, with no tour, `Product` or `Event` schema.
2. **CLOSED (6M).** Six stale brand-asset and footer claims in CLAUDE.md,
   including two files that do not exist and one self-contradiction. All
   corrected against the codebase.
3. **CLOSED (6M).** CLAUDE.md invariant 6 now names `data/passes.ts` and both
   guard layers.
4. **CLOSED (6M).** `docs/Client-ToDo.md` created as a client meeting agenda,
   sourced only from `client-profile.md`, this file and CLAUDE.md.
5. **CLOSED (6M) — not a defect.** The masthead is `fixed` by design; see the
   reclassification note above. Recorded as expected behaviour.
6. **CLOSED (6M) — not a defect.** No tour carries `status: "past"` in
   committed data, and `upcoming` is correct per the client's instruction. The
   render-path consequence is recorded above rather than treated as a bug.
7. **CLOSED (6M) — reclassified, not deleted.** Ali ruled the 6L "orphan" list
   is reserved Phase 2 Gallery material, and the two loose PNGs are logo
   masters. Recorded under *Asset provenance* below. Nothing was deleted.
8. **OPEN.** Six surplus `export` keywords on symbols used only inside their
   own module (`OrgField`, `organizationJsonLd`, `SummitPass`, `GuardScope`,
   `isGuardedDeploy`, `WHATSAPP_NUMBER`). Cosmetic; not dead code.
9. **CLOSED (6M).** `app/(rail)/layout.tsx` now carries a comment explaining
   what group membership means and why the rail is absent outside it. The
   passthrough itself is unchanged — removing it still needs sign-off.
10. **OPEN — both, and both need the same thing.** The production `robots.txt`
    branch and the absence of `X-Robots-Tag` in production remain unverifiable
    without a real deployed hostname. Neither may be ticked from a local
    build, and neither may be evaluated against a stand-in. See the UNVERIFIED
    section at the top of this file, and D3 of the 6L pass above.
