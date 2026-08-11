#!/usr/bin/env node
/**
 * Measure what the image CDN actually delivers, against a live deploy.
 *
 * USAGE
 *
 *   node scripts/benchmark-images.mjs https://sumadventure.netlify.app
 *
 * Takes the deployed base URL as its one argument. Requires a real deploy —
 * it cannot be run against `next dev` or a local `next build` and tell you
 * anything useful, because the thing under test is Netlify's Image CDN, not
 * Next's dev-time optimiser. They are different encoders and they do not
 * produce the same bytes.
 *
 * WHAT IT DOES
 *
 *   1. Reads /sitemap.xml from the deploy to learn which pages exist, rather
 *      than carrying its own list of routes that would go stale.
 *   2. Fetches each page and extracts every `/_next/image?...` URL it emits,
 *      from `src` and from every candidate in `srcset`. These are the exact
 *      URLs a browser would request — not a guess at what the site "should"
 *      be asking for.
 *   3. Requests each one TWICE, with different `Accept` headers, and reports
 *      both. See below.
 *   4. Maps the `url` parameter back to the source file in `public/` and
 *      stats it on disk, so delivered bytes can be read against the original.
 *
 * WHY TWO REQUESTS PER IMAGE
 *
 *   `image/avif,image/webp,*\/*` is what a current Chrome or Firefox sends,
 *   and it is the best case: AVIF, the smallest of the three formats.
 *
 *   `image/webp,*\/*` is the fallback path — no AVIF offered. That is not a
 *   hypothetical: it is older Android, which is a real share of this
 *   audience, on the metered mobile data this project's bundle decisions are
 *   already built around (see CLAUDE.md invariant 1). A result that only
 *   measures the AVIF path reports a number a meaningful slice of real
 *   visitors never receive.
 *
 *   If the two columns come back identical, the CDN is not negotiating and
 *   that is itself the finding.
 *
 * WHAT IT DELIBERATELY DOES NOT COVER
 *
 *   The two brand marks in `public/brand/` pass `unoptimized` on purpose, so
 *   they never appear as `/_next/image` URLs and will not show up here. That
 *   is correct — they are already hand-cut AVIF and there is nothing for the
 *   CDN to improve. Do not "fix" their absence from this report.
 *
 * READING THE OUTPUT
 *
 *   `ratio` is delivered ÷ source, as a percentage. Lower is better: 25%
 *   means the visitor downloaded a quarter of the original file. A ratio
 *   above 100% means the CDN produced something larger than the source,
 *   which is worth investigating rather than shipping.
 *
 *   Every figure in docs/ predating this script was measured against a
 *   different encoder and should be treated as superseded once this has run.
 */

import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(REPO_ROOT, "public");

/** Modern browser: AVIF offered. */
const ACCEPT_MODERN = "image/avif,image/webp,*/*";
/** Older Android and anything else without AVIF support. */
const ACCEPT_WEBP = "image/webp,*/*";

/** Polite ceiling on parallel requests — this points at the client's site. */
const CONCURRENCY = 6;

function usage(message) {
  if (message) console.error(`\nError: ${message}`);
  console.error(
    `\nUsage: node scripts/benchmark-images.mjs <deployed-base-url>\n\n` +
      `  e.g. node scripts/benchmark-images.mjs https://sumadventure.netlify.app\n\n` +
      `Needs a live deploy. Running it against localhost measures Next's own\n` +
      `optimiser, not Netlify's Image CDN, and the two do not agree.\n`
  );
  process.exit(1);
}

/** Run `worker` over `items`, at most `limit` in flight. Order is preserved. */
async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

/** Page URLs from the deploy's own sitemap. */
async function discoverPages(base) {
  const sitemapUrl = new URL("/sitemap.xml", base).href;
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(
      `GET ${sitemapUrl} returned ${res.status}. Without the sitemap there is ` +
        `no list of pages to crawl.`
    );
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (locs.length === 0) throw new Error(`No <loc> entries in ${sitemapUrl}.`);

  // Rewrite onto the base being tested: the sitemap states canonical URLs from
  // NEXT_PUBLIC_SITE_URL, which is not necessarily the host we were pointed at.
  return locs.map((loc) => new URL(new URL(loc).pathname, base).href);
}

/**
 * Every distinct `/_next/image` URL a page emits.
 *
 * Attribute values arrive HTML-escaped (`&amp;`), and `srcset` holds a
 * comma-separated list of "url descriptor" pairs, so both need unpicking
 * before the URLs are usable.
 */
function extractImageUrls(html, base) {
  const found = new Set();

  for (const attr of html.matchAll(/(?:src|srcset)="([^"]*_next\/image[^"]*)"/g)) {
    const value = attr[1].replace(/&amp;/g, "&");
    for (const candidate of value.split(",")) {
      const urlPart = candidate.trim().split(/\s+/)[0];
      if (urlPart.includes("/_next/image")) {
        found.add(new URL(urlPart, base).href);
      }
    }
  }

  return [...found];
}

/** Source file on disk for a `/_next/image?url=...` request, if it is local. */
async function sourceBytes(imageUrl) {
  const inner = new URL(imageUrl).searchParams.get("url");
  if (!inner) return { path: null, bytes: null, note: "no url parameter" };
  if (/^https?:\/\//i.test(inner)) {
    return { path: inner, bytes: null, note: "remote source, not on disk" };
  }

  const rel = decodeURIComponent(inner).replace(/^\//, "");
  const onDisk = path.join(PUBLIC_DIR, rel);
  try {
    const info = await stat(onDisk);
    return { path: `public/${rel}`, bytes: info.size, note: null };
  } catch {
    return { path: `public/${rel}`, bytes: null, note: "not found on disk" };
  }
}

/** One request. Falls back to counting body bytes when content-length is absent. */
async function measure(imageUrl, accept) {
  const res = await fetch(imageUrl, { headers: { Accept: accept } });
  const declared = res.headers.get("content-length");
  // Chunked responses omit content-length; read the body to get a real number.
  const bytes = declared !== null ? Number(declared) : (await res.arrayBuffer()).byteLength;
  return {
    status: res.status,
    contentType: res.headers.get("content-type") ?? "(none)",
    bytes: res.ok ? bytes : null,
  };
}

function formatBytes(n) {
  if (n === null || n === undefined) return "—";
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

function formatRatio(delivered, source) {
  if (delivered === null || !source) return "—";
  return `${((delivered / source) * 100).toFixed(1)}%`;
}

async function main() {
  const [, , rawBase] = process.argv;
  if (!rawBase) usage("no base URL given");

  let base;
  try {
    base = new URL(rawBase).origin;
  } catch {
    usage(`"${rawBase}" is not an absolute URL — it needs a protocol.`);
  }

  console.log(`Base URL:   ${base}`);
  console.log(`Modern:     ${ACCEPT_MODERN}`);
  console.log(`Fallback:   ${ACCEPT_WEBP}\n`);

  const pages = await discoverPages(base);
  console.log(`Pages from sitemap: ${pages.length}`);

  const perPage = await mapLimit(pages, CONCURRENCY, async (page) => {
    const res = await fetch(page);
    if (!res.ok) {
      console.warn(`  ! ${page} returned ${res.status}; skipped`);
      return [];
    }
    return extractImageUrls(await res.text(), base);
  });

  const imageUrls = [...new Set(perPage.flat())].sort();
  console.log(`Distinct /_next/image URLs: ${imageUrls.length}\n`);

  if (imageUrls.length === 0) {
    console.log(
      `Nothing to measure. Either the pages emit no optimised images, or the\n` +
        `markup changed shape and extractImageUrls() needs updating.`
    );
    return;
  }

  const rows = await mapLimit(imageUrls, CONCURRENCY, async (imageUrl) => {
    const [modern, webp, source] = await Promise.all([
      measure(imageUrl, ACCEPT_MODERN),
      measure(imageUrl, ACCEPT_WEBP),
      sourceBytes(imageUrl),
    ]);
    return { imageUrl, modern, webp, source };
  });

  for (const { imageUrl, modern, webp, source } of rows) {
    const requested = new URL(imageUrl);
    console.log(`${requested.pathname}${requested.search}`);
    console.log(`  source        ${source.path ?? "—"}${source.note ? `  (${source.note})` : ""}`);
    console.log(`  source bytes  ${formatBytes(source.bytes)}`);
    console.log(
      `  modern        ${String(modern.status).padEnd(4)} ` +
        `${modern.contentType.padEnd(12)} ${formatBytes(modern.bytes).padStart(9)}` +
        `   ratio ${formatRatio(modern.bytes, source.bytes)}`
    );
    console.log(
      `  webp-only     ${String(webp.status).padEnd(4)} ` +
        `${webp.contentType.padEnd(12)} ${formatBytes(webp.bytes).padStart(9)}` +
        `   ratio ${formatRatio(webp.bytes, source.bytes)}`
    );
    console.log();
  }

  // Totals are what the docs figures should be restated from.
  const totals = rows.reduce(
    (acc, r) => ({
      source: acc.source + (r.source.bytes ?? 0),
      modern: acc.modern + (r.modern.bytes ?? 0),
      webp: acc.webp + (r.webp.bytes ?? 0),
    }),
    { source: 0, modern: 0, webp: 0 }
  );

  console.log(`${"-".repeat(64)}`);
  console.log(`Images measured   ${rows.length}`);
  console.log(`Source on disk    ${formatBytes(totals.source)}`);
  console.log(
    `Delivered modern  ${formatBytes(totals.modern)}   ` +
      `ratio ${formatRatio(totals.modern, totals.source)}`
  );
  console.log(
    `Delivered webp    ${formatBytes(totals.webp)}   ` +
      `ratio ${formatRatio(totals.webp, totals.source)}`
  );

  const identical = rows.every(
    (r) => r.modern.contentType === r.webp.contentType && r.modern.bytes === r.webp.bytes
  );
  if (identical) {
    console.log(
      `\nNote: both Accept headers returned identical responses for every\n` +
        `image. The CDN is not content-negotiating — worth checking before\n` +
        `quoting either column.`
    );
  }
}

main().catch((err) => {
  console.error(`\nbenchmark-images: ${err.message}`);
  process.exit(1);
});
