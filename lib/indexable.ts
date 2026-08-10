/**
 * The single answer to "may a crawler index this build?".
 *
 * Two consumers, and they must never disagree: the `X-Robots-Tag` header in
 * `next.config.ts` and the `robots.txt` route in `app/robots.ts`. They were
 * two independent copies of the same condition until Sprint 9; a shared
 * function is the only way that stays true.
 *
 * DELIBERATELY DEPENDENCY-FREE. `next.config.ts` imports this, and the config
 * is loaded before anything else in the project. In particular it must not
 * import `lib/site.ts`, which throws on an unset NEXT_PUBLIC_SITE_URL — that
 * throw is correct where it lives, but from inside config loading it would
 * surface as an unrelated-looking config error.
 *
 * THE RULE: index only when the build context is production **and** the
 * canonical host is not a Netlify-assigned one.
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

/** Netlify's own deploy domain. Any host under it is never indexable. */
const NETLIFY_SUFFIX = ".netlify.app";

/**
 * Pure form, so it can be reasoned about and exercised with explicit inputs
 * rather than by mutating the environment.
 */
export function isIndexableHost(
  siteUrl: string | undefined,
  context: string | undefined
): boolean {
  // Anything that is not a production build: no.
  if (context !== "production") return false;

  // No canonical origin configured: fail closed. A build with no site URL
  // cannot state a canonical host, and an uncanonical indexable page is the
  // duplicate-content problem this exists to avoid.
  if (!siteUrl) return false;

  let hostname: string;
  try {
    hostname = new URL(siteUrl).hostname.toLowerCase();
  } catch {
    // Malformed value. lib/site.ts throws its own, better error for this
    // during the build proper; here we simply decline to index.
    return false;
  }

  // `.netlify.app` and the bare apex both excluded. `endsWith` on the dotted
  // suffix is what stops `notnetlify.app` matching.
  if (hostname === "netlify.app" || hostname.endsWith(NETLIFY_SUFFIX)) {
    return false;
  }

  return true;
}

/** Environment-reading form, for the two real call sites. */
export function isIndexableBuild(): boolean {
  return isIndexableHost(process.env.NEXT_PUBLIC_SITE_URL, process.env.CONTEXT);
}
