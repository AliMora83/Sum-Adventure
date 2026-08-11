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

- Netlify production deployment (and, since Sprint 9, indexability itself —
  the hostname decides it: a site left on `<name>.netlify.app` stays
  `noindex` by design)
- `robots.txt` production verification (see the risk note below)
- `X-Robots-Tag` production verification (see the risk note below)
- OG metadata origin — `NEXT_PUBLIC_SITE_URL` is the root of `metadataBase`,
  so it becomes every canonical link, every share-card image URL and the
  `sitemap.xml` origin. Nothing downstream validates it; a wrong value
  produces a site that looks entirely correct while publishing a domain
  nobody owns.

**Ask:** does the client own a domain already, and who holds the registrar
login. If it does not exist yet, that purchase is the long pole.

### 3. JSON-LD business details — NOT SUPPLIED — **HARD LAUNCH GATE**

**These five fields are a hard gate on launch, not a content nicety.** The
site cannot go live on the client's domain until they are supplied. This is
the single most launch-critical item on the list after the domain itself.

Five values, all currently placeholders in `data/organization.ts`:

1. **`url`** — the canonical business URL. Currently `https://example.invalid`,
   a reserved non-resolving stand-in.
2. **`streetAddress`** — `[UNCONFIRMED]`. Only `addressCountry: "LS"` is
   derivable, from the +266 phone number.
3. **`addressLocality`** — `[UNCONFIRMED]`
4. **`openingHours`** — `[UNCONFIRMED]`
5. **`sameAs`** — social handles, `[UNCONFIRMED]`

(The **registration number** is separately `[UNCONFIRMED]`. We have the legal
name "Sum Adventures (Pty) Ltd" from the profile and it is not a placeholder;
the number is not currently in the markup and does not gate the build.)

**Why this is hard-blocking rather than cosmetic.** JSON-LD is a
machine-readable claim about a real registered company, submitted to search
engines, which may surface it as fact in a result card. A wrong address is
not a typo — it is a business sending customers to the wrong place. So the
guard in `data/organization.ts` runs at scope `any-deploy` and **throws on
any build where `CONTEXT` is set** — production, deploy-preview and
branch-deploy alike. Until these five land, the project can only be built
locally.

**The gate has an override, and that override is itself a launch blocker.**
`ALLOW_PROVISIONAL_DEPLOY=1` downgrades the guard to a warning and lets the
build through with all five placeholders intact. It exists for a throwaway
preview of unrelated work. If it is left set on the Netlify environment at
launch, these five fabricated values are published about a real company with
nothing to catch it. Deleting it before any deploy on the real domain is a
LAUNCH BLOCKING item in `docs/launch-checklist.md`.

Read that together: **the only clean way through this gate is the client's
actual data.** Anything else is either a failed build or a bypassed one.

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

**Blocks:** nothing, as of Sprint 9. The page now says
`Seasonal · departure dates on enquiry`, which is accurate whether the trip
repeats or not, so the site no longer asserts anything a "one-off" answer
would falsify. The 31 August 2026 status flip this used to block is
withdrawn — see `docs/launch-checklist.md`. Still worth confirming; no longer
holding anything up.

**Ask:** confirm or correct the standing-activity framing in one sentence.

### 8. Afriski season close date — NOT SUPPLIED

**Why:** nothing in the codebase knows about any date. There is no date field
on `Tour`, no date filtering, no scheduled job and no build failure — a tour
goes past only when a human edits `status` by hand. The `availability` line
added in Sprint 9 is copy, not a schedule: nothing parses it and nothing
branches on it.

**Blocks:** nothing mechanical any more — the 31 August 2026 flip this used
to block is withdrawn. What remains is a plain content gap: the site tells a
customer to ask when the trip runs, because we genuinely do not know. That is
honest and it is what the client asked for, but it is not an answer, and
"when is snow season at Afriski?" is the first question a buyer asks. Do not
close this gap by writing a month range into `availability` — that would be
inventing the answer rather than getting it.

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

`next.config.ts` serves `X-Robots-Tag: noindex` on every build *except* a real
production one, to keep staging out of search results. Since Sprint 9 "a real
production one" means two things at once: `CONTEXT === "production"` **and** a
canonical hostname that does not end in `.netlify.app`. Its **presence** is
verified, including on a production-context build still pointed at a Netlify
host. Its **absence** in production has never been observed on a real deploy
— every check so far has used a stand-in hostname against a local server.
There is no way to test the real production branch without a real deployed
hostname.

The hostname half adds a second route to the same silent failure: a site
connected to Netlify but still answering on `<name>.netlify.app` stays
`noindex` by design. That is the safe direction — but if the custom domain is
attached and `NEXT_PUBLIC_SITE_URL` is not updated with it, the live site
looks perfect and is invisible to search.

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
