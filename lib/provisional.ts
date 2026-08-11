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
 *   "any-deploy"  Any non-local environment is off-limits. No caller today;
 *                 kept because it is the strictest scope and the one to reach
 *                 for if a future field must not exist off localhost at all.
 *
 *   "real-domain" Deploy **and** a real custom domain. The scope for content
 *                 that is safe to ship to the noindexed `netlify.app` staging
 *                 host but must never reach the client's actual domain.
 *                 (data/organization.ts, data/passes.ts, as of Sprint 11)
 *
 * WHY "real-domain" EXISTS. Both JSON-LD and the pass names were on
 * "any-deploy", which is correct in principle and blocked every Netlify build
 * in practice: the site's only address is `<name>.netlify.app` until the
 * client's domain is attached, so "any deploy" and "the real site" were the
 * same set, and nothing could be deployed for review at all. That host is
 * already `noindex` — see lib/indexable.ts, which reads the same host test
 * from lib/deploy-host.ts — so a crawler is not reaching the fabricated
 * claims there. The harm "any-deploy" was defending against begins at the
 * real domain, and that is where this scope starts enforcing.
 *
 * It re-arms with no code change. `NEXT_PUBLIC_SITE_URL` is the single launch
 * switch: point it at the client's domain and these guards fire, the noindex
 * header lifts, and robots.txt opens — all three from that one value.
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
 * Local work is never blocked under any scope: a plain `next build` leaves
 * CONTEXT unset, and `netlify dev` sets it to "dev".
 */
import { currentHost } from "./deploy-host";

export type GuardScope = "production" | "any-deploy" | "real-domain";

/** The env var that disarms the guards. Exported so the docs and the warning
 *  banner cannot disagree about its name. */
export const BYPASS_VAR = "ALLOW_PROVISIONAL_DEPLOY";

/**
 * True only when the bypass is set to exactly "1" **and** the host is one
 * where bypassing is allowed at all.
 *
 * **Fails closed on the value.** Any other value — "true", "yes", "0", a typo,
 * an empty string — leaves the guards armed. The alternative, treating any
 * non-empty value as truthy, means a mistyped variable silently disables
 * every guard in the project, which is the one failure this whole file
 * exists to prevent. An escape hatch that opens by accident is not a guard.
 *
 * **Fails closed on the host, as of Sprint 11.** The bypass is a diagnostic
 * for the staging host, and it is honoured only on `netlify` and `local`
 * hosts. On a `real` host — or an `unknown` one, see `isRealDomainDeploy`
 * below — it is ignored outright and the guard throws anyway.
 *
 * This is the half that matters, because the bypass is an environment
 * variable in the Netlify dashboard and dashboard variables outlive the
 * reason they were set. Left behind, it would have gone on suppressing the
 * guards through the domain switch — silently publishing fabricated company
 * details on the client's real site, which is the exact failure the guards
 * exist for. Deleting it before launch was a checklist item; now forgetting
 * to delete it costs nothing.
 */
function isBypassed(): boolean {
  if (process.env[BYPASS_VAR] !== "1") return false;
  const host = currentHost();
  return host === "netlify" || host === "local";
}

/**
 * True when the deploy is on a real custom domain — the "real-domain" half.
 *
 * **Fails closed: `unknown` enforces.** An unset, empty or unparseable
 * `NEXT_PUBLIC_SITE_URL` means we cannot tell where this build is going, and
 * an unknown destination is treated as the client's live domain, not as safe.
 * The asymmetry is the whole point: wrongly enforcing costs a failed build
 * with a message naming exactly what to fix, while wrongly skipping publishes
 * fabricated claims about a real registered company under its own domain.
 * A guard that cannot tell must not assume the harmless case.
 *
 * Note this is deliberately *not* `classifyHost(...) === "real"`, which would
 * let `unknown` skip. Only the two positively-identified safe hosts skip.
 */
function isRealDomainDeploy(): boolean {
  const host = currentHost();
  return host !== "netlify" && host !== "local";
}

/** True when the current build is one this scope forbids provisional data in. */
export function isGuardedDeploy(scope: GuardScope): boolean {
  const context = process.env.CONTEXT;
  // Unset (plain local build) or "dev" (`netlify dev`) is localhost.
  if (context === undefined || context === "" || context === "dev") return false;

  switch (scope) {
    // Every deploy, whatever its address.
    case "any-deploy":
      return true;
    // "deploy-preview" and "branch-deploy" are both real, publicly reachable
    // deploys; only "production" is caught here.
    case "production":
      return context === "production";
    // A deploy (established above) whose canonical host is the real domain.
    case "real-domain":
      return isRealDomainDeploy();
  }
}

/**
 * Abort the build if `offenders` is non-empty and the environment is one the
 * scope forbids. `offenders` must be human-readable field descriptors — the
 * error has to name what is wrong, or it just sends whoever hits it hunting.
 *
 * With ALLOW_PROVISIONAL_DEPLOY=1 **on a staging or loopback host** the build
 * is allowed through, but never quietly: every offending field is printed with
 * the file it came from, under a banner sized to survive being skim-read in a
 * Netlify deploy log. On a real domain the bypass is ignored and this throws
 * regardless — see `isBypassed`.
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
        `CONTEXT is "${process.env.CONTEXT}" and the canonical host is ` +
        `"${process.env.NEXT_PUBLIC_SITE_URL ?? "(unset)"}" (${currentHost()}).\n` +
        `\n` +
        `${offenders.length} placeholder value${plural} from ${source} ` +
        `will be published:\n` +
        `${fieldList}\n` +
        `\n` +
        `${remedy}\n` +
        `\n` +
        `This bypass is honoured only on this staging/loopback host. It is\n` +
        `ignored once NEXT_PUBLIC_SITE_URL points at the real domain, so it\n` +
        `cannot follow the site to launch — but delete it when you are done\n` +
        `anyway. See docs/launch-checklist.md.\n` +
        `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n`
    );
    return;
  }

  const host = currentHost();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "(unset)";

  // The bypass is honoured only on the staging and loopback hosts. Offering
  // it as a way out on a real or unidentifiable host would send whoever hits
  // this to set a variable that does nothing.
  const escapeHatch =
    host === "netlify" || host === "local"
      ? `To build anyway — for a throwaway preview only, never for the real ` +
        `domain — set ${BYPASS_VAR}=1. It downgrades this to a warning and ` +
        `prints every offending field.`
      : `${BYPASS_VAR} cannot clear this. It is ignored on a real domain, ` +
        `and on a host that cannot be identified, precisely so a variable ` +
        `left over in the Netlify dashboard cannot suppress this guard at ` +
        `launch. Supply the real values, or point NEXT_PUBLIC_SITE_URL back ` +
        `at the ${".netlify.app"} staging host.`;

  throw new Error(
    `${source}: provisional data must never reach the client's real domain. ` +
      `CONTEXT is "${process.env.CONTEXT}" and NEXT_PUBLIC_SITE_URL is ` +
      `"${siteUrl}", which is a "${host}" host.\n\n` +
      `Offending field${plural}:\n` +
      fieldList +
      `\n\n${remedy}\n\n${escapeHatch}`
  );
}
