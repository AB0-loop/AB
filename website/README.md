# Aurum Bespoke — Official Website

Appointment-only bespoke menswear atelier in Bengaluru.
**Fit That Speaks Before You Do.**

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Cloudflare Workers · Drizzle ORM + PostgreSQL

---

## One-tap launch

```bash
npm install
echo "CLOUDFLARE_API_TOKEN=your_token_here" > .env
npm run launch
```

That is the whole setup. Every public ID (GA4, GTM, Clarity, Search Console,
Web3Forms, IndexNow) is committed in `src/site/lib/public-config.ts`, so a fresh
clone of the private repo builds a fully working, fully tracked site with no
other configuration.

`npm run launch` runs eight steps, all idempotent:

1. Verifies the Cloudflare token (and prints the exact permissions if rejected)
2. Builds the static export
3. Uploads any Worker secrets
4. **Deletes the old GitHub Pages DNS records** that would otherwise block the
   Worker custom domain
5. Deploys the Worker and attaches `aurumbespoke.com` + `www`
6. Applies SSL strict, HSTS, HTTP/3, 0-RTT, Brotli, Early Hints, SPF, DMARC
7. Submits URLs to **IndexNow** (Bing, Yandex, Seznam, Naver)
8. Pings the sitemap endpoints

**The repository can be private.** Nothing is served from GitHub. Cloudflare
receives the built output directly from your machine (or from a CI runner), so
repo visibility is irrelevant.

### Steps `npm run launch` cannot do for you

These need a human in a browser. None of them block the site going live.

| Step | Where | Why it cannot be scripted |
| --- | --- | --- |
| Click **Verify** in Search Console | search.google.com/search-console | The meta tag is already in the page; Google requires a human to confirm |
| Submit the sitemap | Search Console → Sitemaps | Google retired the ping API in 2023 |
| Import to Bing Webmaster Tools | bing.com/webmasters | One-click import from Search Console |
| Point Google Business Profile at the site | business.google.com | Requires the verified GBP owner |
| Restrict the Web3Forms key to your domain | web3forms.com dashboard | Account setting |
| Confirm `hello@aurumbespoke.com` receives mail | your mail host | Nothing in this repo can test it |

### Canonical host

The live site serves the **apex** (`aurumbespoke.com`) and `www` 301s to it, so
the apex is what Google has indexed. This project keeps that direction — the
Worker folds `www` into the apex. Flipping to `www` would be a domain migration
with a temporary ranking dip for no benefit. Change `NEXT_PUBLIC_SITE_URL` and
the Worker redirect together if you ever want to.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development on `:3000` |
| `npm run launch` | **Full deploy** — build, secrets, Worker, DNS, TLS |
| `npm run deploy` | Build + deploy only (skips DNS/TLS) |
| `npm run build:static` | Produce `out/` without deploying |
| `npm run build` | Node server build (for a non-Cloudflare host) |
| `npm run db:push` | Apply the Drizzle schema |
| `npm run icons` | Regenerate all favicons + OG card from the master logo |
| `npm run typecheck` | TypeScript, no emit |

---

## Architecture

The site is a single pre-rendered page served as static files from Cloudflare's
edge — no server, no cold start, no origin round-trip. `worker/index.ts` sits in
front of the assets and does three things: redirects the apex to `www`, applies
security headers, and handles `POST /api/bookings`.

Because the export is static, `src/app/api/*` (the Node + PostgreSQL path used in
development) is moved aside during the Cloudflare build by `scripts/build-static.mjs`
and restored afterwards. Both paths expose the same URL, so the front-end never
changes.

```
src/app/         routes, metadata, sitemap, robots, llms.txt, manifest
src/site/lib/    site.ts — all content;  jsonld.tsx — structured data
src/site/components/
worker/          Cloudflare Worker (edge routing + form endpoint)
scripts/         build-static.mjs, launch.mjs
```

---

## Environment

Copy `.env.example` to `.env` and fill it in. `.env` is git-ignored.

| Key | Exposed to browser | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin for metadata, sitemap, JSON-LD |
| `NEXT_PUBLIC_GA_ID` | yes | Google Analytics 4 |
| `NEXT_PUBLIC_GTM_ID` | yes | Google Tag Manager |
| `NEXT_PUBLIC_CLARITY_ID` | yes | Microsoft Clarity |
| `NEXT_PUBLIC_GSC_VERIFICATION` | yes | Search Console meta verification |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | yes | Emails the booking form to the atelier |
| `BOOKING_WEBHOOK_URL` | **no** | Optional extra sink for enquiry records |
| `CLOUDFLARE_API_TOKEN` | **no** | Used only by `scripts/launch.mjs` |
| `DATABASE_URL` | **no** | Local/Node booking storage |

The `NEXT_PUBLIC_*` values are rendered into the HTML by design — that is how
every analytics tag on the web works, and they are not secrets. The Web3Forms
key is a **form ID**, not a credential: their free plan only accepts submissions
from the browser and rejects server IPs. Lock it to `aurumbespoke.com` under
*Domain Restriction* in the Web3Forms dashboard so nobody else can post to it.

`CLOUDFLARE_API_TOKEN` and `DATABASE_URL` never reach the browser — they are read
only by `scripts/launch.mjs` and the Node server respectively.

---

## SEO / AEO / GEO

- Server-rendered HTML for every section — crawlable with JavaScript disabled.
- Canonical, Open Graph, Twitter card, robots directives, geo meta, GSC verification.
- `sitemap.xml` declares one canonical URL plus an **image sitemap** of all 29
  photographs. Hash fragments are deliberately excluded — listing them reads as
  duplicate content and wastes crawl budget.
- `robots.txt` grants search crawlers and answer engines (GPTBot, PerplexityBot,
  ClaudeBot, OAI-SearchBot, Google-Extended, Applebot-Extended…) full access,
  blocks bandwidth-only scrapers, and shields `/api/`.
- `llms.txt` gives AI assistants a factual brief plus explicit guidance not to
  invent prices, awards or client counts.
- JSON-LD `@graph`: ClothingStore + LocalBusiness + Organization (both founders),
  WebSite, WebPage, Service, BreadcrumbList, FAQPage — generated from the same
  data the page renders, so answers can never drift.
- Crawl files carry `X-Robots-Tag: all` and edge caching; API routes carry
  `no-store` + `noindex`.

---

## Editing content

Everything lives in **`src/site/lib/site.ts`** — brand, founders, phone, email,
collections, suits, process, FAQ, portfolio, service areas. Change it once and
the page, sitemap, structured data and `llms.txt` all update together.

## Replacing the logo / favicon pack

Drop your files into **`public/brand/`** — see `public/brand/README.md` for the
exact filenames. Either:

- paste a ready-made favicon pack in with matching names, or
- replace `public/brand/aurum-mark.png` with your square master and run
  `npm run icons` to regenerate every size, the OG card, and the two files
  Next.js reads from `src/app/`.

No code changes needed either way.

---

## Bookings

Two paths, both validated client-side and both protected by a hidden honeypot:

1. **WhatsApp (primary)** — opens a pre-filled chat instantly. Nothing to fail.
2. **Email** — posts directly to Web3Forms from the browser, which delivers to
   the atelier's inbox, then lands on `/thank-you`.

Both also fire a background `POST /api/bookings`. On a Node host that writes a
durable row to PostgreSQL; on Cloudflare the Worker acknowledges it and can
forward to `BOOKING_WEBHOOK_URL` if you set one. A failure there never blocks or
loses the enquiry.

Mark `/thank-you` as the conversion goal in GA4; the form also pushes a
`generate_lead` event into GTM with the chosen garment.
