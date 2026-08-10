/**
 * The provisional-data build guard, shared.
 *
 * This is the mechanism that used to live inline at the bottom of
 * data/stations.ts. It was lifted here in Sprint 6F so the JSON-LD
 * organisation data could use the same guard rather than growing a second,
 * subtly different copy of it — two guards drift, and the one that drifts is
 * the one that stops firing.
 *
 * Still a hard throw by default, not a warning. A warning is exactly what let a stray
 * dummy elevation ("3798m") sit unnoticed on the rail marker for four
 * sprints. Throwing at module-import time aborts `next build`.
 *
 * SCOPE — the two callers guard against different things and deliberately
 * fire at different times:
 *
 *   "production"  A provisional *elevation* is meant to be seen on preview
 *                 deploys; reviewing it there is the entire point of carrying
 *                 one. Only production is off-limits. (data/stations.ts)
 *
 *   "any-deploy"  Placeholder *JSON-LD* is invisible on the page, so there is
 *                 nothing to review and nothing to gain by shipping it to a
 *                 preview — while a crawler that reaches the preview would be
 *                 reading fabricated claims about a real registered company.
 *                 Any non-local environment is off-limits. (data/organization.ts,
 *                 data/passes.ts)
 *
 * PLATFORM — keyed on `CONTEXT`, which is Netlify's build context, as of
 * Sprint 9. It replaced `VERCEL_ENV` when the site moved off Vercel, and the
 * swap was not cosmetic: `VERCEL_ENV` is simply unset on Netlify, so every
 * guard in this file silently returned false on every deploy. A guard that
 * cannot fire is worse than no guard, because the build log still looks
 * clean. If this project ever moves again, this is the first thing to change.
 *
 * Netlify sets CONTEXT to one of:
 *   "production"      the production branch, on the site's real domain
 *   "deploy-preview"  a pull-request preview
 *   "branch-deploy"   any other tracked branch, e.g. staging
 *   "dev"             `netlify dev`, running locally
 *
 * Local work is never blocked under either scope: a plain `next build` leaves
 * CONTEXT unset, and `netlify dev` sets it to "dev".
 */
export type GuardScope = "production" | "any-deploy";

/** The env var that disarms the guards. Exported so the docs and the warning
 *  banner cannot disagree about its name. */
export const BYPASS_VAR = "ALLOW_PROVISIONAL_DEPLOY";

/**
 * True only when the bypass is set to exactly "1".
 *
 * **Fails closed on purpose.** Any other value — "true", "yes", "0", a typo,
 * an empty string — leaves the guards armed. The alternative, treating any
 * non-empty value as truthy, means a mistyped variable silently disables
 * every guard in the project, which is the one failure this whole file
 * exists to prevent. An escape hatch that opens by accident is not a guard.
 */
function isBypassed(): boolean {
  return process.env[BYPASS_VAR] === "1";
}

/** True when the current build is one this scope forbids provisional data in. */
export function isGuardedDeploy(scope: GuardScope): boolean {
  const context = process.env.CONTEXT;
  // Unset (plain local build) or "dev" (`netlify dev`) is localhost.
  if (context === undefined || context === "" || context === "dev") return false;
  // "deploy-preview" and "branch-deploy" are both real, publicly reachable
  // deploys, and are treated as such: only "production" clears the narrower
  // scope, everything else is caught by "any-deploy".
  return scope === "any-deploy" ? true : context === "production";
}

/**
 * Abort the build if `offenders` is non-empty and the environment is one the
 * scope forbids. `offenders` must be human-readable field descriptors — the
 * error has to name what is wrong, or it just sends whoever hits it hunting.
 *
 * With ALLOW_PROVISIONAL_DEPLOY=1 the build is allowed through, but never
 * quietly: every offending field is printed with the file it came from, under
 * a banner sized to survive being skim-read in a Netlify deploy log.
 */
export function assertNoProvisional({
  source,
  scope,
  offenders,
  remedy,
}: {
  source: string;
  scope: GuardScope;
  offenders: string[];
  remedy: string;
}): void {
  if (offenders.length === 0) return;
  if (!isGuardedDeploy(scope)) return;

  const plural = offenders.length === 1 ? "" : "s";
  const fieldList = offenders.map((f) => `  - ${source}: ${f}`).join("\n");

  if (isBypassed()) {
    console.warn(
      `\n` +
        `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n` +
        `!!  PROVISIONAL DATA IS SHIPPING — GUARD BYPASSED               !!\n` +
        `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n` +
        `\n` +
        `${BYPASS_VAR}=1 is set, so this build was allowed to continue.\n` +
        `CONTEXT is "${process.env.CONTEXT}".\n` +
        `\n` +
        `${offenders.length} placeholder value${plural} from ${source} ` +
        `will be published:\n` +
        `${fieldList}\n` +
        `\n` +
        `${remedy}\n` +
        `\n` +
        `Delete ${BYPASS_VAR} from the Netlify environment before any deploy\n` +
        `on the real domain. See docs/launch-checklist.md.\n` +
        `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n`
    );
    return;
  }

  throw new Error(
    `${source}: provisional data must never reach a deployed environment, ` +
      `and CONTEXT is "${process.env.CONTEXT}".\n\n` +
      `Offending field${plural}:\n` +
      fieldList +
      `\n\n${remedy}\n\n` +
      `To build anyway — for a throwaway preview only, never for the real ` +
      `domain — set ${BYPASS_VAR}=1. It downgrades this to a warning and ` +
      `prints every offending field.`
  );
}
