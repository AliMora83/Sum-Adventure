import { assertNoProvisional } from "@/lib/provisional";

/**
 * The six named passes that reach the Tsikoane summit.
 *
 * Lifted out of `components/sections/Tsikoane.tsx` in Sprint 6k so it can
 * carry a build guard the way the other data files do. The rendered section
 * did not change: `Tsikoane.tsx` imports this and keeps its own
 * `.filter((p) => p.confirmed)`. That filter is still the thing that stops
 * placeholders reaching the page — this file is a second layer under it, not
 * a replacement for it.
 *
 * **Only Linareng Pass is confirmed.** The other five are placeholders
 * awaiting Mpho, kept here rather than deleted so they render automatically
 * once named — which is also why they must not be quietly promoted. A name
 * arrives from the client or it does not arrive; `confirmed: true` is not a
 * thing to set to make a build pass. See CLAUDE.md invariant 6.
 */
export type SummitPass = {
  /** Display ordinal, "01".."06". */
  readonly n: string;
  readonly name: string;
  readonly note: string;
  /** false = placeholder awaiting the client; blocks deployed builds. */
  readonly confirmed: boolean;
};

export const passes: readonly SummitPass[] = [
  { n: "01", name: "Linareng Pass", note: "caves route", confirmed: true },
  { n: "02", name: "Pass two", note: "name tbc", confirmed: false },
  { n: "03", name: "Pass three", note: "name tbc", confirmed: false },
  { n: "04", name: "Pass four", note: "name tbc", confirmed: false },
  { n: "05", name: "Pass five", note: "name tbc", confirmed: false },
  { n: "06", name: "Pass six", note: "name tbc", confirmed: false },
];

/**
 * The guard. Scope "any-deploy", matching `data/organization.ts` rather than
 * `data/stations.ts`, and the choice is deliberate.
 *
 * A provisional *elevation* is scoped to "production" because it renders —
 * as a dashed pill and a "prov." suffix — and seeing it on a preview deploy
 * is the entire reason for carrying one. Blocking previews would block the
 * review the value exists for.
 *
 * These names render nothing, anywhere. The filter in `Tsikoane.tsx` drops
 * them, and that was verified against real build output in Sprint 6k: the
 * strings appear only in a server-only SSR chunk, and in no client bundle, no
 * prerendered HTML and no RSC payload. So there is nothing on a preview for
 * anyone to review, and the stricter scope costs no review value.
 *
 * What decides it is the failure this guard is actually for. The guard is a
 * second layer under a one-line render filter; it earns its place only in the
 * world where that filter has been deleted. In that world the placeholders
 * become five fabricated pass names, about a real registered business, in
 * crawlable HTML. Production-only scope would let that onto every preview
 * served from the client's domain, so the scope has to key on the host, not
 * on the context.
 *
 * **Sprint 11: "any-deploy" → "real-domain".** The argument above is about
 * *crawlable* HTML, and it is the host that decides whether anything is
 * crawlable. The `netlify.app` staging host is `noindex` by header and
 * `Disallow: /` in robots.txt, both derived from the same host test this
 * scope reads (lib/deploy-host.ts), so the placeholders are not reachable by
 * a crawler there. Shipping them to that host is deliberate — under
 * "any-deploy" the site could not be deployed for review at all, since
 * `<name>.netlify.app` is its only address until the domain is attached.
 *
 * **The guard re-arms by itself.** Nothing here needs editing at launch:
 * point `NEXT_PUBLIC_SITE_URL` at the client's real domain and this fires on
 * the next build, with `ALLOW_PROVISIONAL_DEPLOY` unable to suppress it.
 * The render filter in `Tsikoane.tsx` is unchanged and is still the layer
 * that actually keeps these names off the page.
 */
assertNoProvisional({
  source: "data/passes.ts",
  scope: "real-domain",
  offenders: passes
    .filter((p) => !p.confirmed)
    .map((p) => `pass ${p.n} = ${JSON.stringify(p.name)} (${p.note})`),
  remedy:
    `Get the five outstanding summit pass names from Mpho, replace the ` +
    `placeholders, and set \`confirmed: true\` on each. Until then this ` +
    `section can only be built locally. Do not "fix" this by inventing a ` +
    `plausible Sesotho pass name, and do not set \`confirmed: true\` on a ` +
    `placeholder to clear the build — the flag is what keeps the name off ` +
    `the page. Only Linareng Pass is confirmed.`,
});
