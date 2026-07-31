# Launch checklist — engineering blockers

Things that must be verified **on real infrastructure** before the client's
domain goes live. This file is for blockers we own. Items waiting on the
client live under "Outstanding from the client" in `CLAUDE.md`.

Do not tick anything here from a local build, a code reading, or a direct
evaluation of a function. An item is verified when it has been observed on
the deploy it describes.

---

## Unverified — must be checked on the first real production build

### Production `robots.txt` has never been emitted by a build

**Status: UNVERIFIED. Do not mark verified before a real production deploy.**

`app/robots.ts` returns `allow: /` plus a sitemap reference when
`VERCEL_ENV === "production"`, and `disallow: /` otherwise.

The `disallow` branch is genuinely verified — curled over HTTP from
`next start` in Sprint 6b, returning `User-Agent: *` / `Disallow: /`.

The production branch is **not**. It cannot be reached by a real build: the
provisional-elevation guard in `data/stations.ts` aborts any
`VERCEL_ENV=production` build while Tsikoane carries `provisional: true`
(CLAUDE.md invariant 5), so no production `robots.txt` has ever been
generated. The only evaluation of that branch called the function directly,
outside Next, **with a fabricated production hostname** — see invariant 9.
Neither the real origin nor Next's own route rendering was involved.

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

- The past-tour treatment is currently **unexercised in production**. As of
  Sprint 6b no tour carries `status: "past"`, so the badge, the `/tours`
  "Past trips" section and the `"Past trip — this has already run."`
  metadata prefix have never rendered from real data. The prefix was verified
  against a declared fixture, not a real tour.
- Only the client can authorise the flip. Do not set it from a lapsed flyer
  date — that is the exact inference Sprint 5.5 reversed.

Before launch, agree with Mpho who owns this check and how often it happens.
A recurring human review is the only control that exists.

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

### Production is blocked while Tsikoane is provisional

Intended, not a bug. Production builds fail until the client supplies the real
Tsikoane plateau elevation and the `provisional` flag is deleted. The fix is
the client's number, not loosening the guard. See CLAUDE.md invariant 5.

This is also what makes the two items above unverifiable today: they can only
be checked once a production build can succeed at all.
