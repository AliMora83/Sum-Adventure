# Client to-do — what we need from Mpho

Working agenda for Ali's meeting with Mpho Noko, **Tuesday**.

Everything here is sourced from `docs/client-profile.md`, `CLAUDE.md` and
`docs/launch-checklist.md`. **Nothing on this list is invented** — where a
detail is unknown it is marked unknown rather than guessed, per CLAUDE.md
invariants 5 and 9.

**Status of everything below: NOT SUPPLIED as of Sprint 6M (8 August 2026),**
except where a line says otherwise. Two things *have* arrived previously and
are noted in place so they are not asked for twice.

This file was rebuilt in Sprint 6M. It was referenced across the project for
several sprints while not existing.

---

## BLOCKING LAUNCH

The site cannot go live without these. The first two also block each other's
verification.

### 1. Privacy policy text — NOT SUPPLIED

**Why:** `/contact` collects personal data — name, phone/WhatsApp number,
email address, preferred dates, group size and a free-text message — and
emails it onward via Resend. There is **no privacy policy anywhere on the
site**: no page, no route, no link. `docs/client-profile.md:236` lists it as
outstanding alongside terms, cancellation policy and indemnity waiver.

**Blocks:** launching a form that collects contact details from the public
with no stated basis for holding them. This is Mpho's text to approve — we
should not draft a policy on the client's behalf and present it as theirs.

**Ask:** who controls the data, how long it is kept, who it is shared with,
and a contact route for deletion requests.

### 2. Domain and DNS access — NOT SUPPLIED

**Why:** no deployment of this project exists — not production, not preview,
not staging. Nothing has been served from anywhere other than localhost.
`NEXT_PUBLIC_SITE_URL` is set to `http://localhost:3000` locally and is unset
everywhere else, because there is nowhere else yet. **No hostname is recorded
anywhere in this repo and none may be invented** (CLAUDE.md invariant 9).

**Blocks four things at once**, which is why this is the highest-leverage item
in the meeting:

- Vercel production deployment
- `robots.txt` production verification (see the risk note below)
- `X-Robots-Tag` production verification (see the risk note below)
- OG metadata origin — `NEXT_PUBLIC_SITE_URL` is the root of `metadataBase`,
  so it becomes every canonical link, every share-card image URL and the
  `sitemap.xml` origin. Nothing downstream validates it; a wrong value
  produces a site that looks entirely correct while publishing a domain
  nobody owns.

**Ask:** does the client own a domain already, and who holds the registrar
login. If it does not exist yet, that purchase is the long pole.

### 3. JSON-LD business details — NOT SUPPLIED

Four values, all currently placeholders in `data/organization.ts`:

- **Registered legal name** — we have "Sum Adventures (Pty) Ltd" from the
  profile; the **registration number** is `[UNCONFIRMED]`
- **Physical address** — street and locality both `[UNCONFIRMED]`. Only
  `addressCountry: "LS"` is derivable, from the +266 phone number.
- **Operating hours** — `[UNCONFIRMED]`
- **Social handles** — `[UNCONFIRMED]`

**Why this one is hard-blocking rather than cosmetic:** the guard in
`data/organization.ts` runs at scope `any-deploy` and **throws on any build
where `VERCEL_ENV` is set** — production *and* preview. Until these four land,
the project cannot be deployed anywhere at all, only built locally. That is
deliberate: JSON-LD is a machine-readable claim about a real registered
company, submitted to search engines, which may surface it as fact.

**Ask:** the registration certificate, the trading address, opening hours, and
the Facebook/Instagram URLs. Do not accept approximations — a plausible wrong
address is worse than a missing one, because it sends customers somewhere.

---

## BLOCKING CONTENT

The site can technically launch without these, but launches weaker or with
visible placeholders.

### 4. Photography — PARTLY SUPPLIED

| Shot | Status | What it blocks |
| --- | --- | --- |
| Hero image | **NOT SUPPLIED** — currently a placeholder | The hero scrim is tuned to the *current placeholder photo*: worst-case H1 contrast is 4.41:1 at a 55% scrim. That ratio is a property of that photograph, not of the scrim. **A new hero must be re-sampled before launch** or the headline can silently fail contrast. This is a BLOCKING item in the launch checklist. |
| Cave-ceiling minowane | **SUPPLIED** (Sprint 7) | Three images arrived; `footprints-2.jpeg` is the live Tsikoane background. Do not ask again. `footprints-1.jpg` and `footprints-3.jpeg` are held for the Phase 2 Gallery. |
| Tsikoane plateau summit | **NOT SUPPLIED** | The flagship tour's own section has no summit photograph |
| Bonfire | **NOT SUPPLIED** | Listed as a headline inclusion of the flagship tour, unillustrated |
| Basotho meal | **NOT SUPPLIED** | Same |
| Mpho Noko portrait | **NOT SUPPLIED** | An initials placeholder stands in on the About page |

### 5. Tsikoane summit pass names 02–06 — NOT SUPPLIED

**Why:** only `01 Linareng Pass` is confirmed. The other five are placeholders
(`Pass two`…`Pass six`, each noted `name tbc`) in `data/passes.ts`.

**What it blocks:** nothing on the page — and this is deliberate. Two layers
keep them off: the render filter in `Tsikoane.tsx` drops every unconfirmed
pass, and the build guard in `data/passes.ts` aborts any deployed build while
one remains. The section already tells the reader there are six passes and
five names are to come, so nothing shown is wrong — it is simply less complete
than it will be.

**Chase the names, but do not hold launch for them.** Note the guard shares a
scope with item 3, so it is a second reason a deploy will fail until resolved.

**Do not invent names.** A plausible Sesotho pass name is exactly the kind of
detail a local customer would catch.

### 6. Real testimonials — NOT SUPPLIED

**Why:** CLAUDE.md invariant 6 forbids placeholder testimonials presented as
real. There are none on the site and none may be written.

**Blocks:** any social-proof section. There is no placeholder to replace —
the section simply does not exist yet.

### 7. Afriski Winter Day Trip — standing-activity framing — NOT CONFIRMED

**Why:** the site currently presents this as a standing, always-available
activity with dates agreed per enquiry. That framing came from the client in
Sprint 5.5, but `docs/client-profile.md:149` still marks it `[UNCONFIRMED]`.
The underlying question: did the 25 July 2026 flyer describe a one-off
departure, or does the trip repeat?

**Blocks:** whether the 31 August 2026 status flip should happen at all.

**Ask:** confirm or correct the standing-activity framing in one sentence.

### 8. Afriski season close date — NOT SUPPLIED

**Why:** nothing in the codebase knows about any date. There is no date field
on `Tour`, no date filtering, no scheduled job and no build failure — a tour
goes past only when a human edits `status` by hand.

**Blocks:** the 31 August 2026 flip, which is a calendar commitment held by a
person (Ali) and nothing else. If the season actually closes on a different
date, that commitment is wrong. If the date passes and nobody makes the edit,
the site keeps presenting the trip as bookable with a live price and a
WhatsApp booking link, indefinitely and silently.

---

## Also outstanding, not blocking

- **Vector logo `.svg`** — the masthead ships raster AVIF. Works; a vector
  would be sharper at every size.
- **Confirmation that *minowane* is the customer-facing term** — used
  prominently in the Tsikoane section.
- **Tagline conflict** — the logo lockup reads "Travel Is Adventure Having
  Fun"; the profile and every flyer say "More Than Just A Trip". The site uses
  the latter. Worth one sentence of confirmation.
- **Branded email address** — `sumadventures3@gmail.com` is
  `[UNCONFIRMED]` and pending the domain, so it rides on item 2.

---

## Highest-risk item: `X-Robots-Tag` in production

Flagged separately because it is the one failure that is **both invisible and
catastrophic**, and it cannot be tested until item 2 lands.

`next.config.ts` serves `X-Robots-Tag: noindex` on every environment *except*
production, to keep staging out of search results. Its **presence** on
non-production is verified. Its **absence** in production has never been
observed, and **cannot be** — a local build has `VERCEL_ENV` unset, which is
the non-production branch by definition. There is no way to test the
production branch without a real deployed hostname.

**If that header is wrongly present in production, Google and Bing silently
deindex the entire site.** No error, no warning, no visible symptom — the site
looks perfect and simply never appears in search results, on a project whose
whole purpose is being findable.

The production `robots.txt` branch has the same shape and the same blocker,
but a lower ceiling on the damage: `robots.txt` is a request a crawler may
ignore, whereas `X-Robots-Tag` is served on the response and is honoured.

**First action after the domain is connected:** `curl -I` the live production
origin and confirm no `X-Robots-Tag` is present, then fetch `/robots.txt` and
confirm it allows crawling and names the correct sitemap origin. Neither may
be ticked off from a local build, and neither may be checked against a
stand-in hostname.
