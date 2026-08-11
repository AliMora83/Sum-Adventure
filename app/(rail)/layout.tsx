/**
 * VESTIGIAL — this layout no longer renders anything of its own.
 *
 * ==== WHAT MEMBERSHIP OF THIS GROUP MEANS TODAY ====
 *
 * Nothing behavioural. `(rail)` is a route group, so it contributes no URL
 * segment, and this layout is a bare passthrough — a page's membership changes
 * neither its path nor what wraps it. The four members (`/`, `/about`,
 * `/tours`, `/tours/[slug]`) and the one non-member (`/contact`) render
 * through identical machinery.
 *
 * **The name is a historical label, not a description.** It records that these
 * routes once shared the altitude rail. Do not read it as "these routes have
 * the rail" — only the homepage does.
 *
 * ==== WHY THE RAIL IS ABSENT OUTSIDE THIS GROUP ====
 *
 * It is absent outside this group for the same reason it is absent from three
 * of the four routes *inside* it: **the rail is mounted by the page, not by
 * any layout.** `<AltitudeRail />` appears exactly once in the codebase, in
 * `(rail)/page.tsx`. Nothing inherits it.
 *
 * That is the whole mechanism, and it is deliberate. The rail used to be
 * mounted here, which leaked it onto `/about`, `/tours` and `/tours/[slug]`,
 * where the elevation narrative it draws does not exist. Moving the mount into
 * the page makes the rail *structurally* absent everywhere else — not hidden,
 * not conditionally rendered, simply not in the tree.
 *
 * Deliberately NOT solved with a `usePathname()` check in a shared layout:
 * that needs a client boundary (invariant 1) and leaves the component mounted
 * site-wide and merely hidden, which is a different and worse thing than
 * absent. A CSS `display: none` has the same defect — the SVG, its paths and
 * its scroll timelines would still ship on every route.
 *
 * `/contact` sits outside the group for an unrelated reason: it is a
 * transactional page with a plain centred container and no rail gutter, so it
 * has nothing to clear. See the comment in `app/contact/page.tsx`.
 *
 * ==== IF YOU ARE TEMPTED TO REMOVE THIS ====
 *
 * The group and this passthrough both earn nothing and could go — the pages
 * can sit directly under `app/`. That means deleting and moving files, which
 * CLAUDE.md says to confirm first, so it is left in place pending that
 * go-ahead. **Do not hang new shared behaviour off this layout in the
 * meantime** — anything added here silently reaches all four routes, which is
 * the exact failure that moved the rail out.
 */
export default function RailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
