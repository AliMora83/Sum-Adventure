/**
 * VESTIGIAL — this layout no longer renders anything of its own.
 *
 * It used to mount <AltitudeRail /> for every page in the group (home, about,
 * tours, tours/[slug]). The rail is now the homepage's alone and is mounted
 * directly in `(rail)/page.tsx`, so a shared layout can't leak it onto a
 * sibling route again. Deliberately NOT solved with a `usePathname()` check:
 * that needs a client boundary (invariant 1) and leaves the component mounted
 * site-wide, hidden rather than absent.
 *
 * The group name is now inaccurate and this passthrough earns nothing. Both
 * should go — the pages can sit directly under `app/` — but that means
 * deleting and moving files, which CLAUDE.md says to confirm first. Left in
 * place pending that go-ahead; do not hang new shared behaviour off it in the
 * meantime.
 */
export default function RailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
