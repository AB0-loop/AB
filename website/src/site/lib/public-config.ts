/**
 * Public configuration.
 *
 * Every value here is rendered into the HTML and visible in page source on any
 * site that uses these services — they are identifiers, not credentials. They
 * are committed deliberately so that a fresh `git clone` of a private repo
 * builds a fully working, fully tracked site with no `.env` file at all.
 *
 * Anything genuinely secret (Cloudflare API token, DATABASE_URL) lives in
 * `.env`, which is git-ignored and never bundled.
 *
 * Each value can still be overridden per-environment via `NEXT_PUBLIC_*`.
 */

/** Canonical origin. The apex is what the live site serves and what Google has indexed. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurumbespoke.com"
).replace(/\/$/, "");

/** Google Analytics 4 measurement ID (stream 12006806444). */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-EV18G05FL2";

/** Google Tag Manager container. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KHDJKS67";

/** Microsoft Clarity project. */
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "xrid73bhko";

/** Google Search Console HTML-tag verification token. */
export const GSC_VERIFICATION =
  process.env.NEXT_PUBLIC_GSC_VERIFICATION ??
  "PkXqlkx1Sh89JyATEe-P9R39otirK4hR4h3dTAjt9s8";

/**
 * Web3Forms access key. Their free plan only accepts browser-side submissions
 * and rejects server IPs, so this is a public form ID by design. Restrict it to
 * aurumbespoke.com under Domain Restriction in the Web3Forms dashboard.
 */
export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "81489f13-e7cc-44b3-b005-8e58b2a46246";

/**
 * IndexNow key — instant URL submission to Bing, Yandex, Seznam and Naver.
 * Must match the filename served from `public/<key>.txt`.
 */
export const INDEXNOW_KEY =
  process.env.NEXT_PUBLIC_INDEXNOW_KEY ?? "382450a00fd726eefeae7c26f22e808f";
