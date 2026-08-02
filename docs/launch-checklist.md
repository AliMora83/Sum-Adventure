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
  things covered — there is no JSON-LD or other structured data in this repo,
  so there was nothing there to cover. CLAUDE.md invariant 8 is the standing
  instruction for if any is ever added.)

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
