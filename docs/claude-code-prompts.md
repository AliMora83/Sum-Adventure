# Claude Code prompts

Paste these in sequence. Prompt 1 gets the project running and pushed. Prompt 2
is Sprint 4. Don't combine them — long multi-phase prompts drift.

> **These prompts predate the Netlify migration and are kept verbatim as a
> record — they are not updated in place.** Prompts 2 and 3 below mention
> Vercel; the deploy target has been Netlify since Sprint 8, and there is no
> Vercel account to deploy to. If you reuse prompt 3, substitute a Netlify
> branch deploy, and note that a deploy carrying placeholder data now fails
> the build by design (`lib/provisional.ts`). See `docs/launch-checklist.md`.

`CLAUDE.md` in the repo root carries the invariants, so these prompts stay short
and don't need to re-state the constraints.

---

## Prompt 1 — Bootstrap

Open Claude Code **in `SumAdv/SumWebsite/`** so the relative paths below resolve.

```
You are in SumAdv/SumWebsite, the project root for the Sum Adventures website.
Read CLAUDE.md first. Goal: a running, committed, pushed Next.js project.

FIRST — verify the source is actually here. Run:
  find . -type f -not -path "./.git/*" | sort | wc -l
Expect 29 files including app/globals.css, components/, data/, lib/ and
public/images/. If you only see a handful of .md files plus next.config.ts and
tsconfig.json, the source did not unzip — stop and tell me, do not try to
recreate the missing files from scratch.

1. IMAGES. The client photography sits one level up in "Supplied Images"
   (note the space). Copy it in, renaming to strip spaces:

     cp "../Supplied Images/skii-1.jpg"      public/images/
     cp "../Supplied Images/skii-3.jpg"      public/images/
     cp "../Supplied Images/skii-5.jpg"      public/images/
     cp "../Supplied Images/horse riding.jpg" public/images/horse-riding.jpg

   Copy the remaining skii-*.jpg files in too — they are unused now but Sprint 4
   tour galleries will want them.

   DO NOT copy ../SumAdv_logo.png or ../SumAdv_icon.png into public/images/.
   Those are the client originals and have solid white backgrounds, which would
   put a white box on the navy masthead. public/images/sumadv-icon.png is
   already the corrected version with the white knocked out. Leave it alone.

   Then convert the JPEGs to a sane size. They are camera originals and the
   audience is on metered mobile data — cap the long edge at 1920px and target
   under 300KB each. Report the before and after totals.

2. SCAFFOLD. Generate a Next.js project in a temp directory:
     npx create-next-app@latest /tmp/_nextgen --typescript --eslint --app \
       --tailwind --no-src-dir --import-alias "@/*"

   Move ONLY these into the project root: package.json, package-lock.json,
   the eslint config, next-env.d.ts.

   Do NOT copy the generated app/, globals.css, layout.tsx, page.tsx,
   next.config.ts, tsconfig.json or postcss.config.mjs. The versions already
   here are the real ones — overwriting app/globals.css would delete the entire
   design token system and motion layer. Delete /tmp/_nextgen afterwards.

3. VERSIONS. Ensure next is >= 16.2.12. Next 15 is end-of-support in October
   2026, and the July 2026 release patched a denial-of-service affecting App
   Router apps with Server Actions, which Sprint 4 adds. Confirm Tailwind is v4
   and that no tailwind.config file was created.

4. BUILD. npm install, then npm run build and npm run lint. Fix errors in the
   existing source but do not restructure it. If a fix would require breaking a
   CLAUDE.md invariant, stop and tell me instead.

5. VISUAL CHECK. npm run dev, then tell me what to look at. Specifically:
   - the altitude rail draws its profile line as I scroll, and the orange
     marker follows the path's kinks rather than sliding straight down
   - the Tsikoane cave-ceiling footprints are visible and NOT covered by the
     overhang gradient
   - the Tsikoane section's background moves DOWN as I scroll down, opposite to
     every other section
   - the masthead logo has no white box behind it

6. COMMIT. Show me the diff summary first. Then:
     git init && git branch -M main
     git remote add origin https://github.com/AliMora83/Sum-Adventure.git
     git add -A
     git commit -m "Sprint 3: scaffold, design tokens, altitude rail, homepage"
     git push -u origin main

   Do not commit if the build fails. Do not commit .env.local or the
   unoptimised image originals.

Report: installed Next and Tailwind versions, build output size, image sizes
before and after, any files you changed and why.
```

## Prompt 2 — Sprint 4

Only run this once Prompt 1 is pushed and the build is clean.

```
Sprint 4. Read CLAUDE.md first. Four deliverables, in this order. Commit after
each one so I can review incrementally — do not do all four then commit once.

1. TOUR DETAIL ROUTES — app/tours/[slug]/page.tsx
   Statically generated via generateStaticParams from data/tours.ts. Reuse the
   existing Station chip, Contours and Button components; do not build new
   primitives if an existing one fits. Each page needs: hero with the tour's
   image and its elevation chip, the includes list, duration, price, minimum
   pax where set, and both a WhatsApp CTA via tourEnquiryLink() and a link to
   the enquiry form prefilled with that tour. Add generateMetadata per route.
   notFound() for unknown slugs.

2. ABOUT PAGE — app/about/page.tsx
   Content comes from the client profile: founded by Mpho Noko, a Tourism
   Management graduate; three service lines (tours, photography/videography,
   events); mission and values. Condense the eight stated core values to four —
   listing all eight reads as filler. Keep the initials placeholder for his
   portrait. Place this page on the altitude spine at Hlotse, 1,631 m.

3. ENQUIRY FORM — app/contact/page.tsx plus a Server Action
   Fields: name, phone/WhatsApp, email, tour of interest (a select populated
   from data/tours.ts), preferred dates, group size, message.

   The form is the one justified client boundary in this project. Scope
   "use client" to the form component only, never the page or layout. Build it
   as a plain <form action={serverAction}> so it works with JavaScript
   disabled, then layer useActionState on top for pending and error states.

   Validation server-side as the source of truth. Add a honeypot field. Do not
   add a captcha — CLAUDE.md's audience notes apply and a captcha on a 3G
   connection will cost enquiries.

   Send via Resend, reading RESEND_API_KEY / ENQUIRY_TO_EMAIL /
   ENQUIRY_FROM_EMAIL from env. Two emails: the enquiry to the client, and a
   plain-text confirmation to the customer. Fail gracefully with a message
   pointing at WhatsApp if Resend errors — never lose an enquiry silently.

   Do not commit any key. Tell me what to put in .env.local.

4. NAVIGATION
   Update the masthead and footer to link the new routes. Replace the current
   anchor links with real hrefs where a page now exists.

Constraints to hold throughout: no new dependencies beyond resend without
asking; no payment processing; no invented elevations, prices or tour names.
Run npm run build and npm run lint before each commit and paste me the output.

Do not deploy to Vercel yet — I want to review locally first.
```

---

## Prompt 3 — after Sprint 4 review

```
Deploy a Vercel preview from the current main branch. Configure the env vars
for the enquiry form, then give me the preview URL and a short QA checklist
covering: the form's no-JavaScript path, the WhatsApp deep links on a real
phone, the rail on desktop, the static fallback in Firefox, and Lighthouse on
throttled 3G with a mid-range mobile profile.

Report the LCP figure. The target is under 2.5s on throttled 3G — if the hero
image blows that budget, tell me before optimising it so we can decide together
whether to compress harder or change the image.
```

---

## Notes on why these are shaped this way

**Prompt 1's step 2 is the risky one.** The obvious failure is Claude Code
running `create-next-app` in place and silently overwriting `globals.css`,
`layout.tsx` and `next.config.ts` with generated defaults — which would delete
the entire token system and motion layer. Hence the explicit do-not-copy list.

**Incremental commits in Prompt 2** are deliberate. Four deliverables in one
commit is unreviewable, and the enquiry form is the piece most likely to need
correction.

**The form's client boundary** is called out explicitly because it's the one
place the project's central invariant bends, and an agent that reads "no
`use client` anywhere" will otherwise either refuse or quietly break the rule
across the whole page.

**"Tell me before optimising"** in Prompt 3 exists because performance fixes
involve tradeoffs the client should weigh — image quality against load time is
Mpho's call, not an implementation detail.
