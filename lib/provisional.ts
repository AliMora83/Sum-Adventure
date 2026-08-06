/**
 * The provisional-data build guard, shared.
 *
 * This is the mechanism that used to live inline at the bottom of
 * data/stations.ts. It was lifted here in Sprint 6F so the JSON-LD
 * organisation data could use the same guard rather than growing a second,
 * subtly different copy of it — two guards drift, and the one that drifts is
 * the one that stops firing.
 *
 * Still a hard throw, not a warning. A warning is exactly what let a stray
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
 *                 Any non-local environment is off-limits. (data/organization.ts)
 *
 * Local work is never blocked under either scope: `next dev` and a plain local
 * `next build` leave VERCEL_ENV unset, and `vercel dev` sets it to
 * "development".
 */
export type GuardScope = "production" | "any-deploy";

/** True when the current build is one this scope forbids provisional data in. */
export function isGuardedDeploy(scope: GuardScope): boolean {
  const env = process.env.VERCEL_ENV;
  // Unset (plain local build) or "development" (`vercel dev`) is localhost.
  if (env === undefined || env === "" || env === "development") return false;
  return scope === "any-deploy" ? true : env === "production";
}

/**
 * Abort the build if `offenders` is non-empty and the environment is one the
 * scope forbids. `offenders` must be human-readable field descriptors — the
 * error has to name what is wrong, or it just sends whoever hits it hunting.
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

  throw new Error(
    `${source}: provisional data must never reach a deployed environment, ` +
      `and VERCEL_ENV is "${process.env.VERCEL_ENV}".\n\n` +
      `Offending field${offenders.length === 1 ? "" : "s"}:\n` +
      offenders.map((f) => `  - ${f}`).join("\n") +
      `\n\n${remedy}`
  );
}
