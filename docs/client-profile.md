# Client profile — Sum Adventures (Pty) Ltd

Source content supplied by the client. **This is the only sanctioned source for
company copy.** If something is not in this file, it has not been supplied —
do not invent it. See CLAUDE.md.

Anything marked **[UNCONFIRMED]** must not appear on the site.
Anything marked **[EDITORIAL]** is our condensed rewrite of client text and
needs Mpho's sign-off before launch.

---

## Identity

- **Registered name:** Sum Adventures (Pty) Ltd
- **Tagline:** More Than Just A Trip
  - The logo lockup reads "Travel Is Adventure Having Fun". That is retired.
    The site uses "More Than Just A Trip" only.
- **Base:** Hlotse, Leribe district, Lesotho
- **Founder:** Mpho Noko — Founder & Chief Executive Officer
- **Phone / WhatsApp:** +266 6247 9447
- **Email:** sumadventures3@gmail.com **[UNCONFIRMED — branded address pending domain]**
- **Registration number:** **[UNCONFIRMED]**
- **Physical address:** **[UNCONFIRMED]**
- **Social handles:** **[UNCONFIRMED]**

## Philosophy

> We believe every journey should become a story worth telling.

## Vision

To become one of Southern Africa's leading adventure tourism companies by
providing authentic travel experiences, promoting sustainable tourism, and
empowering local communities through tourism development.

## Mission — verbatim as supplied

Seven bullets, exactly as the client wrote them:

1. Promote Lesotho as a world-class tourism destination.
2. Create unforgettable travel experiences.
3. Support community tourism initiatives.
4. Develop innovative tourism products.
5. Inspire people to travel, explore and appreciate nature.
6. Help businesses market themselves through creative photography and videography.
7. Build partnerships that grow the tourism industry.

**[EDITORIAL]** Seven bullets reads as a list, not a mission. On the About page,
render as prose drawn only from the above — no new claims, no added scope.
Suggested condensation, pending sign-off:

> Promote Lesotho as a world-class destination, create travel experiences worth
> remembering, and build the partnerships and community initiatives that grow
> tourism here — while helping local businesses tell their own story through
> photography and video.

## Core values — all eight as supplied

Professionalism · Integrity · Adventure · Innovation · Sustainability ·
Community Development · Customer Satisfaction · Excellence

**Use four on the site:** Adventure · Community Development · Sustainability ·
Professionalism

Rationale: Integrity, Customer Satisfaction and Excellence are claims every
operator makes and carry no information. Innovation belongs to the future
projects, not the current offering. The four retained are the ones that
distinguish a Lesotho operator specifically, and Professionalism is the one
generic value worth keeping because trust is the actual purchase barrier for a
small operator. **Mpho's call to overrule — these are his company's values.**

## Service lines

Three, in priority order:

1. **Adventure tours** — weekend getaways, day tours, educational tours, school
   excursions, hiking expeditions, camping experiences, cultural tours,
   corporate retreats, team building, custom packages
2. **Photography & videography** — photography, videography, promotional video,
   drone photography, destination marketing, business branding content.
   Clients: tourism businesses, hotels, guest houses, restaurants, events,
   corporates, destinations, social media
3. **Events management** — outdoor events, tourism festivals, community events,
   corporate functions, team building, adventure challenges

## Target market

Families · friends · couples · schools · universities · corporates ·
international tourists · local tourists · adventure enthusiasts · content creators

## Destinations

**Lesotho:** Afriski Mountain Resort · Thaba Bosiu Cultural Village ·
Maletsunyane Falls · Semonkong · Katse Dam · Letseng Diamond Mine ·
Tsikoane Plateau · Bokong Nature Reserve · Liphofung Caves ·
Sehlabathebe National Park

**South Africa:** Durban · Hartbeespoort · Clarens · Lionsrock Big Cat
Sanctuary · Pilanesberg National Park

## Products

### Tsikoane Plateau Camping Experience — flagship

R2,200 per person · 3 days / 2 nights

Includes: guided hiking · dinosaur footprints tour · San rock art tour ·
horse riding · yoga & meditation · sound therapy · traditional Basotho meals ·
bonfire experience · sunrise & sunset photography · team building activities

Plateau elevation: **1,881 m — CONFIRMED by Mpho, Sprint 7.** Supersedes the
provisional 2,600 m that stood in `data/stations.ts` from Sprint 5. It renders
as a normal confirmed elevation everywhere; nothing shows `Elev. TBC` or a
"prov." suffix for Tsikoane any more.
Summit pass names: 1 of 6 confirmed (Linareng Pass). Five **[UNCONFIRMED]**.

### Sum Ultimate Afriski Experience

R4,600 per person · minimum 6 pax · weekend

Includes: accommodation · daily breakfast · transport · Afriski entrance fee ·
full snowpass · equipment rental · ski lesson for all levels · tubing

### Afriski Winter Day Trip — STANDING ACTIVITY

R900 pp (transport & entry) / R1,100 pp (with bum boarding) · R300 deposit ·
departs from Maputsoe · the flyer date was Saturday 25 July 2026

**Status: upcoming.** Superseded in Sprint 5.5 — this section previously read
"PAST TRIP / Status: past", from the client's Sprint 4.5 instruction after the
flyer date lapsed. The client then asked for it to be presented as a
**standing, always-available activity**, with dates agreed per enquiry rather
than tied to the one flyer date. It renders as a normal bookable tour.

The 25 July 2026 date is retained above as provenance for the pricing only.
**Do not treat it as an expiry.** Nothing in the site infers bookability from
a date — there is no date field on `Tour` and none should be added. `status`
flips to `past` only on the client's actual instruction. See CLAUDE.md
invariant 8, and `docs/launch-checklist.md` for the manual-step risk this
creates.

**Scheduled flip: 31 August 2026.** This tour is to be set to
`status: "past"` on that date. Owner: Ali. A single dated action requiring a
repo edit and a redeploy — not a recurring review, and not something the site
does on its own. See `docs/launch-checklist.md`.

Note the two are in tension and neither is settled here: the
"standing, always-available activity" framing above is still **[UNCONFIRMED]**
by Mpho, and a standing activity would not normally carry a flip date at all.
Both facts are recorded as they stand. Confirming the framing with Mpho may
change whether the 31 August flip should happen; do not treat either as
resolved.

### Educational tours

For primary schools, high schools, universities and colleges. Combine education
with adventure via cultural, historical, environmental and conservation sites.
No published price. **[UNCONFIRMED]**

## Why choose Sum Adventures — as supplied

Professional planning · friendly tour guides · local knowledge · photography
opportunities · cultural immersion · adventure activities · safe travel ·
affordable packages · memorable experiences

**[EDITORIAL]** Nine is too many for a UI block. Use four to six, and prefer the
specific over the generic — "photography opportunities" and "local knowledge"
are the two that mean something coming from this company.

## Future projects — Phase 2 or later, not Phase 1

- **Sum Studio** — portrait, passport photos, business branding, product
  photography, podcast studio, content creation, video production
- **Tsikoane Adventure & Heritage Resort** — luxury camping, hiking trails,
  dinosaur heritage centre, horse riding, cultural village, wellness retreat,
  outdoor adventure park, conference facilities, family recreation
- **Tourism marketing programme** — destination photography, promotional video,
  social media, website content, tourism campaigns

Do not put these on the Phase 1 site as current offerings.

## Partnership goals — aspirational, not existing relationships

Ministry of Tourism · Ministry of Education · Lesotho Tourism Development
Corporation (LTDC) · schools and universities · hotels and guest houses ·
tourism attractions · local communities · corporates

**These are stated goals, not signed partnerships.** Do not imply endorsement
or affiliation anywhere on the site.

## Founder bio — as supplied

A Tourism Management graduate with a passion for adventure tourism, destination
marketing, and community development. Mpho founded Sum Adventures to promote
Lesotho as a premier travel destination while creating meaningful travel
experiences that inspire exploration and cultural appreciation.

Portrait: **[UNCONFIRMED]** — initials placeholder in use.
Longer first-person bio requested from client, not yet supplied.

## Brand colours — as stated by client

Sky blue · yellow/orange · black · white

**Superseded.** The site uses the approved navy / icy-blue / orange system in
`app/globals.css`. Do not reintroduce the stated palette.

The client approved a **logo recolour** to match, in Sprint 4.5. That approval
has **never been implemented** — `components/site/Masthead.tsx` still renders
the supplied `sumadv-icon.png` unmodified and the mark is still teal. Approval
is not landing; do not read this paragraph as a record of completed work.

A wider **repalette** is also approved in principle and **not started**. It is
blocked on three values from Ali, none of which have been supplied: the deep
teal that passes AA at 13px white text, the dark surface replacement for navy,
and whether gold survives as CTA fill.

## Not supplied — do not fabricate

- Testimonials of any kind. Placeholders must be visibly marked as placeholder.
- FAQs. The client has been asked for his five most common WhatsApp questions.
- Terms & conditions, cancellation policy, indemnity waiver, privacy policy.
- Any elevation, price, date, pass name or inclusion not listed above.
