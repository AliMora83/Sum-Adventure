# Launch checklist — engineering blockers

Things that must be verified **on real infrastructure** before the client's
domain goes live. This file is for blockers we own. Items waiting on the
client live under "Outstanding from the client" in `CLAUDE.md`.

Do not tick anything here from a local build, a code reading, or a direct
evaluation of a function. An item is verified when it has been observed on
the deploy it describes.

---

## THE LAUNCH SWITCH — one action, not three

**Change `NEXT_PUBLIC_SITE_URL` in the Netlify dashboard from the
`<name>.netlify.app` host to the client's real domain, then redeploy.**

That is the whole launch action. Owner: Ali. It is a dashboard change plus a
deploy — there is no code change, no flag to flip in the repo, and no second
step to remember.

**Three things re-arm automatically as a consequence.** They are listed here
so nobody hunts for them as separate tasks, *not* because they need doing:

1. **The JSON-LD guard** (`data/organization.ts`) starts enforcing and will
   fail the build if any of the five placeholder organisation fields is still
   flagged `provisional: true`.
2. **The pass-names guard** (`data/passes.ts`) starts enforcing and will fail
   the build while any of the five unconfirmed pass names remains.
3. **The `noindex` header lifts** and `robots.txt` flips to `Allow: /`
   (`next.config.ts`, `app/robots.ts`).

All three read the same host test — `lib/deploy-host.ts`, shared by
`lib/indexable.ts` and `lib/provisional.ts` as of Sprint 11 — so they cannot
disagree with each other and cannot be half-applied. One value moves them all.

**Expect the first post-switch build to fail, and that is the system
working.** Items 1 and 2 are the client's outstanding content (five
organisation fields, five pass names — see `docs/Client-ToDo.md`). Until
those arrive, pointing production at the real domain *should* abort the
build rather than publish fabricated claims about a real registered company
on its own domain. The fix is the content, not the guard.

**`ALLOW_PROVISIONAL_DEPLOY` cannot be used to force it through.** As of
Sprint 11 the bypass is ignored on a real host — see its section below.

### Why this is one action and not three

Before Sprint 11 the two guards were scoped `any-deploy`, which fired on
every deploy regardless of address. Since `<name>.netlify.app` is the site's
only address until the domain is attached, that scope made "any deploy" and
"the real site" the same set, and the site could not be deployed for review
at all. They now key on the host instead, which is what the harm was ever
about: the staging host is `noindex` and `Disallow: /` by the same predicate,
so no crawler reaches the placeholders there.

The deliberate consequence: **placeholder JSON-LD and placeholder pass names
are live on the `netlify.app` host right now, on purpose.** They are not
indexable, they are not rendered (the pass names are filtered out by
`Tsikoane.tsx` before markup), and they stop being deployable the moment the
domain switch happens.

---

## Verification attempt, 10 August 2026 — `sumadventure.netlify.app` serves no deployment

**Recorded so nobody re-runs this and re-derives the same negative.** A full
live-verification pass was attempted against
`https://sumadventure.netlify.app` — headers, robots.txt, sitemap, the live
JSON-LD, an image-pipeline benchmark against Netlify's Image CDN, and a font
budget measurement. **None of it could be performed. Nothing is served at
that hostname.**

Every path tested — `/`, `/robots.txt`, `/sitemap.xml`, `/tours`, `/about`,
`/index.html` — returns an identical response:

```
HTTP/2 404
cache-control: private, max-age=0
content-type: text/plain; charset=utf-8
server: Netlify
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-nf-request-id: <varies per request>
```

with a 50-byte body: `Not Found - Request ID: <id>`.

**This is Netlify's edge, not this application.** Three independent pieces of
evidence:

1. **No `X-Robots-Tag` header on any response.** `next.config.ts` applies that
   header at `source: "/:path*"`, which matches every path including a 404 —
   confirmed the same day against the current build under `next start`, where
   `GET /no-such-page` returns `404` **with** `X-Robots-Tag: noindex`. If this
   application were serving that hostname, even its 404s would carry the
   header. Its total absence means our code is not running there.
2. **Wrong shape entirely.** This app's 404 is `text/html`, 24,799 bytes, with
   `x-nextjs-cache` and `x-nextjs-prerender` headers. The live response is
   `text/plain`, 50 bytes, with no Next.js headers at all.
3. **Byte-identical to an unbound name.** A subdomain invented on the spot for
   the comparison — a diagnostic probe, not configuration — returned the same
   status, the same headers and the same body shape. From outside,
   `sumadventure.netlify.app` is indistinguishable from a name nobody has ever
   claimed.

**What cannot be determined from outside**, and must be checked in the Netlify
dashboard rather than guessed: whether no site exists under this name, whether
a site exists but has never had a successful deploy, or whether the site is
published under a different subdomain. All three produce this same response.

**Nothing here is verified by this attempt and nothing moves out of
UNVERIFIED.** In particular the `X-Robots-Tag` and production `robots.txt`
items below are untouched — a 404 from an unbound hostname is not evidence
about either. The Sprint 9 local results still stand exactly as recorded, and
are still local-only.

---

## Deployment: Vercel cancelled, Netlify not yet connected

**Superseded Sprint 8.** This section previously read "Vercel setup and
deployment are PARKED until next week". Vercel was cancelled outright; the
target is Netlify. `netlify.toml` is in the repo root (build command, publish
directory, `NODE_VERSION = "22"`) and Sprint 9 moved every environment check
in the codebase from `VERCEL_ENV` to Netlify's `CONTEXT`.

**The park is over but the state it described is not.** No deployment of this
project exists. Not production, not preview, not staging. Nothing in this repo
has ever been built by any hosted platform or served from anywhere other than
localhost, so every UNVERIFIED item below is still unverified for exactly the
reason it always was.

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
Sprint 7, the `provisional` flag is deleted and `CONTEXT=production`
builds now succeed (verified locally: exit 0, and still exit 1 when a station
is flagged).

**They are now blocked solely on a connected deployment**, which is parked
per the section above. Nothing about the code changed and nothing became more
verified; the reason they cannot be checked simply moved from "the build
aborts" to "there is nowhere to check them".

### Production `robots.txt` has never been emitted by a build

**Status: UNVERIFIED. Do not mark verified before a real production deploy.**
**Blocked on: a connected deployment.**

`app/robots.ts` returns `allow: /` plus a sitemap reference only when
`isIndexableBuild()` is true — `CONTEXT === "production"` **and** the
`NEXT_PUBLIC_SITE_URL` hostname does not end in `.netlify.app` (Sprint 9,
`lib/indexable.ts`). It returns `disallow: /` otherwise.

The `disallow` branch is genuinely verified — curled over HTTP from
`next start` in Sprint 6b, returning `User-Agent: *` / `Disallow: /`.

The production branch is **not**. No production `robots.txt` has ever been
generated. Until Sprint 7 that was because the provisional-elevation guard in
`data/stations.ts` aborted every production-context build; that guard now
passes, and the reason is simply that no deployment exists to build it. The
only evaluation of that branch ever made called the function directly, outside
Next, **with a fabricated production hostname** — see invariant 9. Neither a
real origin nor Next's own route rendering was involved, and that evaluation
remains worthless as verification.

What that leaves unproven, specifically:

- that a production build emits `robots.txt` at all
- that the sitemap URL in it resolves against the real `NEXT_PUBLIC_SITE_URL`
- that `allow: /` is what actually ships, rather than the `disallow` branch
  reached via a `CONTEXT` that is unset or unexpected in the real production
  environment
- that the production `NEXT_PUBLIC_SITE_URL` is the client's own domain and
  not the `<name>.netlify.app` address. On a Netlify host the `disallow`
  branch is taken **by design**, and a site left on its Netlify subdomain
  will therefore never be indexable no matter what `CONTEXT` says

On the first production build, fetch `/robots.txt` from the live origin and
confirm the body allows crawling and names the correct sitemap URL. Confirm
`/sitemap.xml` lists that same origin. Until then this stays unverified even
though the code is believed correct.

### `X-Robots-Tag` in production

**Status: UNVERIFIED. Blocked on: a connected deployment.**

Same shape, same caveat, but the condition changed in Sprint 9 and the check
is now a two-part one.

`next.config.ts` drops the `noindex` header only when `isIndexableBuild()` is
true (`lib/indexable.ts`), which requires **both**:

1. `CONTEXT === "production"` — Netlify's build context, and
2. the `NEXT_PUBLIC_SITE_URL` hostname does **not** end in `.netlify.app`.

Context alone is not sufficient and that is the point. Netlify sets
`CONTEXT=production` on the production branch of a site whose only address is
still `<name>.netlify.app` — which is exactly this project's state the day it
is first connected. Keying on context alone would publish an indexable
Netlify subdomain and the client's real domain would later launch into
duplicate content against it.

Both branches were exercised locally in Sprint 9 against a real `next build`
plus `next start`, using declared stand-in hostnames (`example.netlify.app`
and `example.invalid` — reserved-for-testing values, not real config, see
invariant 9):

| `NEXT_PUBLIC_SITE_URL` host | `X-Robots-Tag` | `robots.txt` |
| --- | --- | --- |
| `example.netlify.app` | `noindex` | `Disallow: /` |
| `example.invalid` | *absent* | `Allow: /` + sitemap |

**That is still not verification.** It proves the logic, not the deployment.
Both runs used stand-in hostnames and a local server. What remains unobserved
is the real production origin.

#### Post-launch verification — do this after the switch

**Status: UNVERIFIED. Blocked on: the domain switch and a published
production deploy.**

After changing `NEXT_PUBLIC_SITE_URL` and redeploying, curl the **published
production deploy** on the client's real domain and confirm no
`X-Robots-Tag` header remains on an HTML response:

```bash
curl -sSI https://<the-client-domain>/ | grep -i x-robots-tag
```

Expect **no output**. Any `x-robots-tag: noindex` here means the site is
being deindexed silently, which is the highest-consequence failure on this
page — it is invisible until traffic never arrives.

Then confirm the other half of the same switch: `/robots.txt` returns
`Allow: /` and names the real origin in its `Sitemap:` line, and
`/sitemap.xml` lists that same origin.

**The check is only meaningful against the published production deploy.**
Netlify injects `X-Robots-Tag: noindex` of its own accord on deploy previews,
on unpublished deploys and on superseded branch deploys — that header comes
from Netlify's edge, not from `next.config.ts`, and no change in this repo
removes it. Running this check against a preview URL, a permalink, or an old
branch deploy will show `noindex` and prove nothing about production. Curl
the live domain, not a deploy URL.

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

### ~~The scheduled 31 August 2026 flip~~ — WITHDRAWN, Sprint 9

Afriski Winter Day Trip was to be set to `status: "past"` on 31 August 2026.
Owner: Ali. **That commitment is withdrawn and nobody should act on it.**

It is withdrawn because Sprint 9 made the tour's availability explicit on the
page: it now renders `Seasonal · departure dates on enquiry`
(`availability` on the tour, `data/tours.ts`). The flip existed to stop the
site presenting a lapsed one-off departure as bookable. A trip that states on
its face that dates are agreed per enquiry does not go stale on a calendar
date, so there is nothing left for the flip to correct — and flipping it to
`past` would now be a *worse* description than leaving it alone, because the
client's position since Sprint 5.5 is that this is a standing activity.

Note what has **not** changed: the flip was never implemented in code. There
was no job, no date field and nothing in the codebase that knew about 31
August 2026 — it was a calendar commitment held by a person. Withdrawing it
removes that commitment; it does not remove a mechanism, because there was
none.

Everything above this heading still holds in full. `status` is still the only
source of truth, it still only moves by hand, and it still only moves on the
client's actual instruction. If Mpho says the season has closed, set it then.

The open question this leaves is unchanged and still with the client: **when
does the Afriski season close?** The seasonal line answers "when does it
run?" with "ask us", which is honest and is what the client asked for. It is
not a substitute for knowing the answer.

## Required configuration

### `ALLOW_PROVISIONAL_DEPLOY` — no longer launch-blocking, still delete it

**Status: HYGIENE, not blocking. Downgraded in Sprint 11. Owner: Ali.**

`ALLOW_PROVISIONAL_DEPLOY=1` downgrades a provisional-data guard from a build
failure to a console warning (`lib/provisional.ts`, Sprint 9). It exists for
one purpose — a throwaway preview of unrelated work while placeholder data is
still outstanding.

**Sprint 11 narrowed it so it cannot follow the site to launch.** The bypass
is now honoured only when the host is `netlify` or `local`. On the client's
real domain — or on any host the build cannot identify — it is ignored
outright and the guard throws regardless. Verified by building, not by
reading: with `CONTEXT=production`,
`NEXT_PUBLIC_SITE_URL=https://example.invalid` (a declared stand-in, see
invariant 9) and `ALLOW_PROVISIONAL_DEPLOY=1`, the build still exits 1.

That closes the failure this item was written for. The variable is a
dashboard setting, and dashboard settings outlive the reason they were set;
left behind, it would previously have gone on suppressing the guards straight
through the domain switch, publishing the ten values below with a clean-looking
build log. It can no longer do that.

**Delete it anyway when the diagnostic work is done.** A disarmed escape hatch
still reads as an armed one to the next person, and the error message it
suppresses on the staging host is the one that tells you what is outstanding.

**For the record, these are the ten fabricated values** the guards exist to
keep off the client's domain — about a real registered company:

`data/organization.ts` — reaches the live JSON-LD, which search engines may
surface as fact in a result card:

1. `url = "https://example.invalid"`
2. `streetAddress = "PLACEHOLDER — awaiting client"`
3. `addressLocality = "PLACEHOLDER — awaiting client"`
4. `openingHours = "PLACEHOLDER — awaiting client"`
5. `sameAs = ["https://example.invalid/placeholder-social"]`

`data/passes.ts` — held off the page by the render filter in
`components/sections/Tsikoane.tsx`; the guard is the backstop for that filter
being deleted:

6. `pass 02 = "Pass two" (name tbc)`
7. `pass 03 = "Pass three" (name tbc)`
8. `pass 04 = "Pass four" (name tbc)`
9. `pass 05 = "Pass five" (name tbc)`
10. `pass 06 = "Pass six" (name tbc)`

The variable fails closed twice over. Only the exact string `1` disarms
anything, so a typo leaves the guards armed; and since Sprint 11 the host has
to be `netlify` or `local` as well, so setting it deliberately and forgetting
no longer reaches the client's domain. What it still does is suppress the
error on the staging host, where that error is the thing telling you what is
outstanding — which is the reason to delete it rather than leave it.

The real fix is upstream of this variable: get the five organisation fields
from Mpho and the five pass names, at which point the guards pass on their
own and the bypass has nothing to bypass. See `docs/Client-ToDo.md`.

### `NEXT_PUBLIC_SITE_URL` must be set per environment

The build **fails** without it (`lib/site.ts`), deliberately — an unset value
used to mean silently emitting relative OG paths no scraper can resolve.

Set it in the Netlify site's environment variables per context, each to that
context's own stable origin: the client's domain for production, the deploy's
own stable URL for branch deploys. Never to a per-deployment URL, and never to
a guessed or placeholder hostname — this value is the root of `metadataBase`,
so it becomes every canonical link, every OG image URL and the `sitemap.xml`
origin at once. Nothing downstream validates it.

**As of Sprint 11 this is the single launch switch — see the top of this
file.** Its hostname now decides three things at once: indexability
(`lib/indexable.ts`) and both provisional-data guards (`lib/provisional.ts`,
scope `real-domain`). All three read one shared host test in
`lib/deploy-host.ts`, so they move together and cannot drift apart.

Leaving production pointed at `<name>.netlify.app` keeps the whole site
`noindex` and keeps the guards quiet, deliberately. That is the safe failure
direction, but it is also silent — see the `X-Robots-Tag` item above.

**The host test fails closed.** An unset, empty or unparseable value is
treated as the real domain, not as safe: the guards enforce. That is
deliberate — a build that cannot tell where it is going must not assume the
harmless case. (`lib/site.ts` also throws outright on an unset value, so in
practice an unset variable fails the build twice over.)

Currently set only in local `.env.local`, to `http://localhost:3000`. The real
values do not exist yet and must not be guessed; this is a blocker to record,
not a gap to fill.

### ~~Production is blocked while Tsikoane is provisional~~ — CLEARED, Sprint 7

The client supplied the Tsikoane plateau elevation (1,881 m) and the
`provisional` flag was deleted, so the guard in `data/stations.ts` no longer
aborts production builds. Confirmed against a real production-condition
build rather than by reading the code: a production-context build exits 0 as
the data now stands, and still exits 1 with the guard's own error when a
station is deliberately flagged. (That check read `VERCEL_ENV=production` at
the time; the equivalent today is `CONTEXT=production`.)

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

### Every image figure in these docs is superseded, pending a live benchmark

**Status: UNVERIFIED. Blocked on: a connected deployment. Not launch
blocking.**

`scripts/benchmark-images.mjs` (Sprint 11) measures what Netlify's Image CDN
actually delivers, per image, against a live deploy. **It has not been run.
It cannot be — it needs a deployment.**

```bash
node scripts/benchmark-images.mjs https://<the-deployed-host>
```

**Every image byte-count currently recorded in this file and in `CLAUDE.md`
was measured against a different encoder** — Next's own optimiser running
locally, or `libvips` at the command line — and none of them is evidence
about what Netlify will serve. That includes the D5 page-weight table (images
515,452 B, 64.2% of `/`), the `w=1920` hero and Tsikoane candidates
(96,385 B and 198,201 B), and the Sprint 6J/6K re-encode findings that decided
`unoptimized` for the two brand marks.

Treat all of them as **superseded** once the script has run against a live
Netlify deploy, and restate them from its output rather than carrying the
local numbers forward. The decisions those numbers supported are not
automatically wrong — the `unoptimized` exemption in particular was about a
q=75 re-encode inflating an already-optimal source, which is a property of
any optimiser — but they were argued from figures a different pipeline
produced, and they should be re-argued from this one.

The script requests each image twice, as a modern browser (AVIF offered) and
as an older Android one (WebP only). Report both columns; the fallback path is
a real share of this audience and a figure quoted only from the AVIF column
overstates what visitors receive.

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
2. `data/passes.ts` calls `assertNoProvisional` at scope `real-domain`
   (Sprint 11; was `any-deploy`), so a deploy whose canonical host is the
   client's real domain aborts while an unconfirmed pass remains. Verified by
   building, not by reading: with `CONTEXT=production` and a real-looking host
   the guard exits 1 naming all five, and it still exits 1 with
   `ALLOW_PROVISIONAL_DEPLOY=1` set, because the bypass is ignored there. On
   the `netlify.app` staging host it correctly does not fire.

**These five placeholders are therefore live on the staging host, by
design.** Layer 1 keeps them out of the markup, and the host is `noindex`
either way; layer 2 stops them reaching the real domain. Before Sprint 11 the
`any-deploy` scope blocked every Netlify build outright, which meant the site
could not be deployed for review while these names were outstanding.

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

**Scope note, Sprint 11.** The two guard rows above record `any-deploy`, which
was accurate on 8 August 2026. Both guards moved to scope `real-domain` in
Sprint 11 — see the launch switch at the top of this file. The rows are left as
measured rather than rewritten, because this section is a dated record of that
pass, not a description of current state.

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

**Production `robots.txt`.** `app/robots.ts` branches on `isIndexableBuild()`
(`CONTEXT === "production"` **and** a non-`.netlify.app` hostname) as of
Sprint 9. Locally the non-indexable branch is confirmed: `GET /robots.txt` off
`next start` returns `User-Agent: *` / `Disallow: /`.

Sprint 9 also drove the indexable branch locally, with `CONTEXT=production`
and `NEXT_PUBLIC_SITE_URL=https://example.invalid` (a stand-in, not
configuration): the body came back `Allow: /` with
`Sitemap: https://example.invalid/sitemap.xml`. **That still proves only the
branch, not the deployment** — the origin is a non-resolving stand-in and the
server was local. To verify: deploy to production, `curl
https://<real-domain>/robots.txt`, confirm `Allow: /` and that the `Sitemap:`
line names the real origin, then confirm `/sitemap.xml` lists that same
origin. Requires a real deployed hostname.

**Absence of `X-Robots-Tag` in production.** `next.config.ts` returns no
headers when `isIndexableBuild()` is true. Presence on a non-indexable build
is confirmed locally — `curl -D -` off `next start` shows
`X-Robots-Tag: noindex`, including with `CONTEXT=production` when the host is
`example.netlify.app`, which is the case the hostname half of the rule exists
for. Absence was also observed locally on a non-Netlify stand-in host.

**Neither local run is verification of production.** Both used stand-in
hostnames against a local server; what has never been observed is the real
origin. To verify: `curl -I` the live production origin and confirm no
`X-Robots-Tag` is present on an HTML response. Requires a real deployed
hostname. This is the higher-risk of the two — a stray `noindex` in production
deindexes the entire site silently, and the new hostname condition adds a
second way to arrive at it: production still pointed at `.netlify.app`.

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

---

# Asset provenance — 8 August 2026 (Sprint 6M)

Ali's ruling on the Sprint 6L "orphan" list. **Nothing here is an orphan and
nothing was deleted.** This section exists so a future reconciliation pass does
not re-flag these files. Counts and byte sizes were measured directly, not
carried over from the 6L report.

## RESERVED — Phase 2 Gallery

Client-supplied photography held for the Gallery page. Unreferenced from code
**by design**, exactly as `footprints-1.jpg` and `footprints-3.jpeg` already
were. Do not delete, and do not report as dead assets.

| File | Bytes | Dimensions |
| --- | --- | --- |
| `public/images/horse-1.jpg` | 140,811 | 1280×853 |
| `public/images/mount-4.jpg` | 129,724 | 1280×853 |
| `public/images/mount-2.jpg` | 126,353 | 1280×853 |
| `public/images/skii-7.jpg` | 116,926 | 1280×853 |
| `public/images/mount-3.jpg` | 104,644 | 1280×960 |
| `public/images/skii-6.jpg` | 72,763 | 1280×853 |
| `public/images/mount-1.jpg` | 59,869 | 1280×960 |
| `public/images/skii-4.jpg` | 59,119 | 1280×853 |
| `public/images/dessert-1.jpg` | 45,268 | 1280×960 |
| `public/images/skii-2.jpg` | 28,311 | 1280×853 |
| **10 files** | **883,788 B (863.0 KiB)** | all JPEG |

**Count correction.** The 6M brief described this as 11 images totalling
~927 KiB. That figure was the 6L orphan subtotal, which included
`public/sum-logo.png` (65,781 B) — reclassified below as a logo master, not
Gallery material. Excluding it: **10 files, 883,788 B (863.0 KiB)**, measured.

Adding the two footprints already reserved in CLAUDE.md
(`footprints-1.jpg` 400,487 B and `footprints-3.jpeg` 242,477 B), the full
Phase 2 Gallery pool is **12 files, 1,526,752 B (1.46 MiB)**.

### Phase 2 task — convert the Gallery set to AVIF

**Do not convert now.** These are raw JPEG at 1280px and none is referenced, so
they cost repo weight only and nothing on the wire. When the Gallery page is
built they become page weight, and 1.46 MiB of JPEG on one page would be by far
the heaviest thing on this site — for context, the entire homepage is 784.3 KiB
today, of which 64% is already imagery.

Convert at that point, not before, and measure rather than assume: Sprint 6J
found the image optimiser re-encodes at q=75 and can produce a *larger* file
than a well-made source. Whether the Gallery serves pre-made AVIF with
`unoptimized` or goes through `/_next/image` is a decision to make with numbers
in hand, the same way the two brand marks were decided.

## Logo masters — unreferenced by design

Untrimmed sources for the two AVIFs the site actually ships. Same status as
`public/brand/icon-source.png` and `apple-icon-source.png`: re-cut from these,
never from a shipped AVIF. **Do not delete.**

| Master | Bytes | Dimensions | Ships as | Bytes | Dimensions |
| --- | --- | --- | --- | --- | --- |
| `public/sum-logo.png` | 65,781 | 800×416 | `public/brand/sum-logo.avif` (masthead) | 9,489 | 260×126 |
| `public/brand/sum-logo-dark.png` | 100,508 | 966×585 | `public/brand/sum-logo-dark.avif` (footer) | 14,033 | 400×196 |

The aspect ratios differ between each master and its AVIF — 1.923 → 2.063 and
1.651 → 2.041 — because the masters carry transparent padding that the shipped
AVIFs have trimmed away. That padding is why an earlier 85px masthead render
looked smaller than its box.

`public/brand/sum-logo-dark.png` was undocumented before this sprint, which is
why 6L could not classify it. Both are now recorded here and in CLAUDE.md.

## Files in `public/` with no documented reason

**None.** Every unreferenced file in `public/` is now accounted for: 12 Phase 2
Gallery images, 2 logo masters, and 2 favicon source masters
(`brand/icon-source.png` 41,205 B, `brand/apple-icon-source.png` 15,859 B).
