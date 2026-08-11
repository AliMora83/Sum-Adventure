import { PHONE_DISPLAY, EMAIL } from "@/lib/whatsapp";
import { assertNoProvisional } from "@/lib/provisional";

/**
 * Structured data about the business, emitted as JSON-LD from app/layout.tsx.
 *
 * This file is held to a stricter standard than the rest of the data layer.
 * Everything else here is copy a human reads in context and can judge; JSON-LD
 * is a machine-readable claim about a real registered company, submitted to
 * search engines, which may surface it as fact in a result card. A wrong
 * address or an invented set of trading hours is not a typo, it is a business
 * sending customers to the wrong place.
 *
 * So the file carries only two kinds of value:
 *
 *   CONFIRMED    Already public on this site, sourced from
 *                docs/client-profile.md. Reused from the existing constants
 *                where they exist rather than retyped, so there is one place
 *                to change the phone number.
 *
 *   PLACEHOLDER  Mpho has not supplied it. Deliberately, obviously fake —
 *                "example.invalid" is a reserved TLD that can never resolve,
 *                and the strings say PLACEHOLDER in capitals. Nothing here is
 *                a plausible-looking guess, because a plausible guess is the
 *                one that survives review and ships. Each is flagged
 *                `provisional: true` and the guard at the bottom of this file
 *                blocks any deployed build while one remains.
 */
export type OrgField<T extends string | readonly string[] = string> = {
  readonly value: T;
  /** true = placeholder awaiting the client; blocks deployed builds. */
  readonly provisional?: boolean;
};

export const organization = {
  // --- Confirmed: docs/client-profile.md, already public on the site ---
  legalName: { value: "Sum Adventures (Pty) Ltd" },
  name: { value: "Sum Adventures" },
  slogan: { value: "More Than Just A Trip" },
  founder: { value: "Mpho Noko" },
  telephone: { value: PHONE_DISPLAY },
  email: { value: EMAIL },
  areaServed: { value: ["Lesotho", "South Africa"] },

  // --- Placeholder: awaiting Mpho. Must never reach a deployed build. ---
  url: { value: "https://example.invalid", provisional: true },
  streetAddress: { value: "PLACEHOLDER — awaiting client", provisional: true },
  addressLocality: { value: "PLACEHOLDER — awaiting client", provisional: true },
  openingHours: { value: "PLACEHOLDER — awaiting client", provisional: true },
  sameAs: {
    value: ["https://example.invalid/placeholder-social"],
    provisional: true,
  },
} satisfies Record<string, OrgField<string> | OrgField<readonly string[]>>;

/**
 * TravelAgency, a LocalBusiness subtype — the correct type for a tour
 * operator that sells trips, as opposed to a plain Organization.
 *
 * `addressCountry` is the one part of the address that is not a placeholder:
 * it is derivable from confirmed data rather than guessed. The client's phone
 * number is +266, the Lesotho country code, and every tour on the site runs
 * inside Lesotho. The street and locality remain unknown.
 */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: organization.name.value,
  legalName: organization.legalName.value,
  slogan: organization.slogan.value,
  url: organization.url.value,
  telephone: organization.telephone.value,
  email: organization.email.value,
  founder: {
    "@type": "Person",
    name: organization.founder.value,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: organization.streetAddress.value,
    addressLocality: organization.addressLocality.value,
    addressCountry: "LS",
  },
  openingHours: organization.openingHours.value,
  areaServed: organization.areaServed.value.map((n) => ({
    "@type": "Country",
    name: n,
  })),
  sameAs: organization.sameAs.value,
} as const;

/**
 * Serialised for the <script> tag. `<` is escaped to its unicode form so a
 * value can never close the script element early — the values here are all
 * static today, but that is a property of the current data, not a guarantee.
 */
export function organizationJsonLdString(): string {
  return JSON.stringify(organizationJsonLd, null, 2).replace(/</g, "\\u003c");
}

/**
 * The guard. Scope "real-domain" as of Sprint 11, previously "any-deploy".
 *
 * Still not "production": a `branch-deploy` or `deploy-preview` served from
 * the client's actual domain is every bit as crawlable as production, and
 * placeholder JSON-LD renders nothing a human would notice, so carrying it to
 * a preview buys no review value to offset the risk.
 *
 * **This placeholder JSON-LD ships to the `netlify.app` staging host on
 * purpose.** That host is `noindex` by header and `Disallow: /` in
 * robots.txt — both from the same host test this scope reads, in
 * lib/deploy-host.ts — so no crawler reaches these fabricated claims there,
 * and the alternative was being unable to deploy the site for review at all.
 *
 * **The guard re-arms by itself.** Nothing here needs editing at launch:
 * point `NEXT_PUBLIC_SITE_URL` at the client's real domain and this fires on
 * the next build. `ALLOW_PROVISIONAL_DEPLOY` cannot suppress it there.
 * See lib/provisional.ts.
 */
assertNoProvisional({
  source: "data/organization.ts",
  scope: "real-domain",
  offenders: (
    Object.entries(organization) as [
      string,
      OrgField<string | readonly string[]>,
    ][]
  )
    .filter(([, field]) => field.provisional)
    .map(([key, field]) => `${key} = ${JSON.stringify(field.value)}`),
  remedy:
    `Get these from Mpho, replace the placeholder values, and delete the ` +
    `\`provisional: true\` flag on each. Until then this markup can only be ` +
    `built locally. Do not "fix" this by inventing a plausible address, ` +
    `trading hours or social handle — a plausible guess is the one that ` +
    `survives review and ships.`,
});
