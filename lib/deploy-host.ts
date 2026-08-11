/**
 * What kind of host is this build's canonical origin? One definition, two
 * policies.
 *
 * WHY THIS IS ITS OWN MODULE. Two unrelated subsystems need the same host
 * test and neither should own it:
 *
 *   lib/indexable.ts    may a crawler index this build?
 *   lib/provisional.ts  may placeholder data ship to this build?
 *
 * Neither imports the other, so there is no circular import to break — this
 * module exists for cohesion, not to dodge a cycle. Putting the test in
 * `indexable.ts` would have made the build guards depend on a module whose
 * stated subject is SEO, and would have quietly made that file's
 * dependency-free constraint (below) load-bearing for the guards as well.
 * A third module keeps the constraint in one small, obvious place.
 *
 * DELIBERATELY DEPENDENCY-FREE, inherited from `lib/indexable.ts` and now the
 * reason that file can stay that way. `next.config.ts` imports `indexable.ts`,
 * which imports this, and the config is loaded before anything else in the
 * project. In particular this must never import `lib/site.ts`, which throws on
 * an unset NEXT_PUBLIC_SITE_URL — that throw is correct where it lives, but
 * from inside config loading it would surface as an unrelated-looking config
 * error. Keep this file free of imports.
 *
 * WHY A CLASSIFICATION AND NOT A BOOLEAN. The two consumers fail in opposite
 * directions on the same unknown input, so no single `isRealHost(): boolean`
 * can serve both without one of them failing open:
 *
 *   unset / malformed URL  →  indexability must answer "do not index"
 *                         →  the guards must answer "enforce"
 *
 * A boolean returning `false` for unknown gives indexability the safe answer
 * and the guards the dangerous one. Returning the *classification* lets each
 * caller apply its own fail-closed rule to the same single piece of parsing,
 * which is what "one definition" has to mean here.
 */

/** Netlify's own deploy domain. Any host under it is a placeholder address. */
const NETLIFY_SUFFIX = ".netlify.app";

/** Loopback names. `.localhost` is reserved for loopback by RFC 6761. */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/**
 * - `real`     a custom domain: the client's actual site
 * - `netlify`  a Netlify-assigned `*.netlify.app` address
 * - `local`    loopback — `next dev`, or a plain local `next build`
 * - `unknown`  unset, empty, or not a parseable absolute URL
 */
export type DeployHost = "real" | "netlify" | "local" | "unknown";

/**
 * Pure form, so it can be reasoned about and exercised with explicit inputs
 * rather than by mutating the environment.
 */
export function classifyHost(siteUrl: string | undefined): DeployHost {
  if (!siteUrl) return "unknown";

  let hostname: string;
  try {
    hostname = new URL(siteUrl).hostname.toLowerCase();
  } catch {
    // Malformed value. lib/site.ts throws its own, better error for this
    // during the build proper; here we simply report that we cannot tell.
    return "unknown";
  }

  if (!hostname) return "unknown";

  // `.netlify.app` and the bare apex both caught. `endsWith` on the dotted
  // suffix is what stops `notnetlify.app` matching.
  if (hostname === "netlify.app" || hostname.endsWith(NETLIFY_SUFFIX)) {
    return "netlify";
  }

  if (LOCAL_HOSTS.has(hostname) || hostname.endsWith(".localhost")) {
    return "local";
  }

  return "real";
}

/** Environment-reading form. The canonical origin for the current build. */
export function currentHost(): DeployHost {
  return classifyHost(process.env.NEXT_PUBLIC_SITE_URL);
}
