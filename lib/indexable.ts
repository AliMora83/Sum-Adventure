/**
 * The single answer to "may a crawler index this build?".
 *
 * Two consumers, and they must never disagree: the `X-Robots-Tag` header in
 * `next.config.ts` and the `robots.txt` route in `app/robots.ts`. They were
 * two independent copies of the same condition until Sprint 9; a shared
 * function is the only way that stays true.
 *
 * DELIBERATELY DEPENDENCY-FREE, apart from `lib/deploy-host.ts`, which is
 * itself held to the same rule for this reason. `next.config.ts` imports this,
 * and the config is loaded before anything else in the project. In particular
 * it must not import `lib/site.ts`, which throws on an unset
 * NEXT_PUBLIC_SITE_URL — that throw is correct where it lives, but from inside
 * config loading it would surface as an unrelated-looking config error.
 *
 * The host test itself moved to `lib/deploy-host.ts` in Sprint 11 and is now
 * shared with the provisional build guards in `lib/provisional.ts`. It is the
 * same parsing, read by two policies with opposite fail directions; see that
 * file for why it returns a classification rather than a boolean.
 *
 * THE RULE: index only when the build context is production **and** the
 * canonical host is a real custom domain.
 *
 * (Sprint 11 note: the second half is now "is positively `real`" rather than
 * "is not `.netlify.app`". The only behavioural difference is a loopback host
 * with CONTEXT=production — a contrived local simulation, never a deploy —
 * which used to be indexable and now is not. That is the fail-closed
 * direction; nothing about a real deploy changed.)
 *
 * Context alone is not enough, and the hostname is the half that actually
 * protects the client. Netlify sets CONTEXT=production for the production
 * branch of *any* site, including one whose only address is
 * `<name>.netlify.app` — which is exactly the state this project is in the
 * day it is first connected, before a custom domain is attached. Keying on
 * context alone would publish an indexable Netlify subdomain, and the real
 * domain would later launch into duplicate content against it: competing
 * with itself for the queries it is trying to win, on a site whose entire
 * purpose is being findable.
 *
 * The hostname alone is not enough either, in the other direction. A
 * branch-deploy can be given a custom hostname, and a `deploy-preview` of the
 * production branch resolves the same NEXT_PUBLIC_SITE_URL as production if
 * the variable is set site-wide. Requiring production context stops those
 * being indexed.
 *
 * Both halves have to hold, and the failure directions are not symmetric:
 * a placeholder or preview host being indexable is a live SEO defect on the
 * client's real domain, while a stray `noindex` on the real domain is a
 * launch-day mistake that is invisible until traffic never arrives. The
 * function therefore fails closed — unset, malformed or unknown input
 * returns false, meaning noindex — and the one thing that must be verified
 * by hand at launch is that the real domain comes back **without** the
 * header. That check is a LAUNCH BLOCKING item in docs/launch-checklist.md.
 */

import { classifyHost } from "./deploy-host";

/**
 * Pure form, so it can be reasoned about and exercised with explicit inputs
 * rather than by mutating the environment.
 *
 * Fails closed on everything that is not positively a real custom domain:
 * `netlify`, `local` and `unknown` all decline to index. A build with no
 * parseable canonical host cannot state a canonical URL, and an uncanonical
 * indexable page is the duplicate-content problem this exists to avoid.
 */
export function isIndexableHost(
  siteUrl: string | undefined,
  context: string | undefined
): boolean {
  // Anything that is not a production build: no.
  if (context !== "production") return false;

  return classifyHost(siteUrl) === "real";
}

/** Environment-reading form, for the two real call sites. */
export function isIndexableBuild(): boolean {
  return isIndexableHost(process.env.NEXT_PUBLIC_SITE_URL, process.env.CONTEXT);
}
