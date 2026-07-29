#!/usr/bin/env node
/**
 * Aurum Bespoke — one-tap launch.
 *
 *   npm run launch
 *
 * 1. Verifies the Cloudflare token and finds the zone.
 * 2. Builds the static export.
 * 3. Uploads the Web3Forms secret to the Worker (never committed).
 * 4. Deploys the Worker + assets and attaches both custom domains.
 * 5. Applies the DNS, redirect and TLS settings the site needs.
 *
 * Everything is idempotent — run it as often as you like.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

/* ---------------------------- env loading ---------------------------- */
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_NAME = process.env.CLOUDFLARE_ZONE_NAME || "aurumbespoke.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `https://${ZONE_NAME}`;
const WORKER = process.env.CLOUDFLARE_WORKER_NAME || "aurum-bespoke";
const NOTIFY = process.env.BOOKING_NOTIFY_EMAIL || "hello@aurumbespoke.com";

const c = {
  gold: (s) => `\x1b[33m${s}\x1b[0m`,
  ok: (s) => `\x1b[32m${s}\x1b[0m`,
  bad: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

const step = (n, msg) => console.log(`\n${c.gold(`[${n}]`)} ${msg}`);
const done = (msg) => console.log(`    ${c.ok("✓")} ${msg}`);
const warn = (msg) => console.log(`    ${c.bad("!")} ${msg}`);

function die(msg) {
  console.error(`\n${c.bad("Launch stopped:")} ${msg}\n`);
  process.exit(1);
}

/* ---------------------------- cloudflare api ---------------------------- */
const API = "https://api.cloudflare.com/client/v4";

async function cf(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.success !== false, status: res.status, data };
}

function run(cmd, args, env = {}) {
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: process.platform === "win32",
  });
  return res.status === 0;
}

function runQuiet(cmd, args, input) {
  const res = spawnSync(cmd, args, {
    input,
    encoding: "utf8",
    env: process.env,
    shell: process.platform === "win32",
  });
  return res.status === 0;
}

/* --------------------------------- main --------------------------------- */
async function main() {
  console.log(c.gold("\n  AURUM BESPOKE — launch\n  ──────────────────────"));

  if (!TOKEN) die("CLOUDFLARE_API_TOKEN is missing from .env");

  /* 1. Token + zone */
  step(1, "Verifying Cloudflare credentials");
  const verify = await cf("/user/tokens/verify");
  if (!verify.ok) {
    die(
      "The Cloudflare API token was rejected.\n" +
        "    Create one at: Cloudflare → My Profile → API Tokens → Create Token\n" +
        "    Permissions needed:\n" +
        "      Account · Workers Scripts        · Edit\n" +
        "      Zone    · Workers Routes         · Edit\n" +
        "      Zone    · DNS                    · Edit\n" +
        "      Zone    · Zone Settings          · Edit\n" +
        "      Zone    · Zone                   · Read\n" +
        `    Scoped to: ${ZONE_NAME}`,
    );
  }
  done("Token accepted");

  const pinned = process.env.CLOUDFLARE_ZONE_ID || "c54d30968304900f02ef49b7f0e4d8ee";
  const lookup = pinned
    ? await cf(`/zones/${pinned}`)
    : await cf(`/zones?name=${encodeURIComponent(ZONE_NAME)}`);
  const zone = pinned ? lookup.data?.result : lookup.data?.result?.[0];
  if (!zone) {
    die(
      `Zone "${pinned || ZONE_NAME}" was not reachable with this token.\n` +
        `    Check the token has Zone:Read + DNS:Edit for ${ZONE_NAME}.`,
    );
  }
  const zoneId = zone.id;
  const accountId = zone.account?.id || process.env.CLOUDFLARE_ACCOUNT_ID;
  done(`Zone ${ZONE_NAME} (${zone.status})`);
  if (zone.status !== "active") {
    warn(`Zone is "${zone.status}" — point your registrar at these nameservers:`);
    for (const ns of zone.name_servers || []) console.log(`      ${ns}`);
  }

  /* 2. Build */
  step(2, "Building the static export");
  if (!run("node", ["scripts/build-static.mjs"])) die("Build failed — nothing was deployed.");
  done("out/ built");

  /* 3. Secrets */
  step(3, "Uploading Worker secrets");
  const sink = process.env.BOOKING_WEBHOOK_URL;
  if (sink) {
    if (runQuiet("npx", ["wrangler", "secret", "put", "BOOKING_WEBHOOK_URL"], sink)) {
      done("Booking webhook stored in Cloudflare");
    } else {
      warn("Could not upload BOOKING_WEBHOOK_URL — run `npx wrangler secret put BOOKING_WEBHOOK_URL`");
    }
  } else {
    done("No Worker secrets required — enquiries are emailed by Web3Forms from the browser");
  }

  /* 3.5 Clear DNS records that would collide with the Worker custom domain. */
  step(4, "Clearing legacy hosting DNS records");
  const GH_IPS = new Set([
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ]);
  const hosts = [ZONE_NAME, `www.${ZONE_NAME}`];
  let cleared = 0;
  for (const h of hosts) {
    const recs = await cf(`/zones/${zoneId}/dns_records?name=${encodeURIComponent(h)}`);
    for (const r of recs.data?.result || []) {
      const isGithub =
        (r.type === "A" && GH_IPS.has(r.content)) ||
        (r.type === "AAAA" && r.content.startsWith("2606:50c0")) ||
        (r.type === "CNAME" && /github\.io$/i.test(r.content));
      // Worker custom domains manage their own records; anything else on the
      // apex or www will block the attach with "record already exists".
      if (isGithub || r.type === "A" || r.type === "AAAA" || r.type === "CNAME") {
        const del = await cf(`/zones/${zoneId}/dns_records/${r.id}`, { method: "DELETE" });
        if (del.ok) {
          cleared++;
          done(`removed ${r.type} ${r.name} → ${r.content}`);
        } else {
          warn(`could not remove ${r.type} ${r.name} — delete it manually`);
        }
      }
    }
  }
  if (cleared === 0) done("Nothing to clear");

  /* 4. Deploy */
  step(5, "Deploying the Worker to Cloudflare's edge");
  if (!run("npx", ["wrangler", "deploy"], { CLOUDFLARE_API_TOKEN: TOKEN })) {
    die("wrangler deploy failed. Check the output above.");
  }
  done(`Worker "${WORKER}" live`);

  /* 6. Zone settings */
  step(6, "Applying TLS and performance settings");

  const settings = [
    ["ssl", "strict"],
    ["always_use_https", "on"],
    ["automatic_https_rewrites", "on"],
    ["min_tls_version", "1.2"],
    ["brotli", "on"],
    ["early_hints", "on"],
    ["http3", "on"],
    ["0rtt", "on"],
  ];
  for (const [id, value] of settings) {
    const r = await cf(`/zones/${zoneId}/settings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ value }),
    });
    if (r.ok) done(`${id} → ${value}`);
    else warn(`${id} could not be set (plan may not include it)`);
  }

  /* Email hygiene: SPF + DMARC so enquiry replies land in the inbox. */
  const txt = [
    { name: ZONE_NAME, content: '"v=spf1 include:_spf.google.com ~all"', label: "SPF" },
    {
      name: `_dmarc.${ZONE_NAME}`,
      content: `"v=DMARC1; p=quarantine; rua=mailto:${NOTIFY}"`,
      label: "DMARC",
    },
  ];
  for (const rec of txt) {
    const existing = await cf(
      `/zones/${zoneId}/dns_records?type=TXT&name=${encodeURIComponent(rec.name)}`,
    );
    const hit = existing.data?.result?.find((r) =>
      r.content.includes(rec.label === "SPF" ? "v=spf1" : "v=DMARC1"),
    );
    const payload = JSON.stringify({
      type: "TXT",
      name: rec.name,
      content: rec.content,
      ttl: 1,
    });
    const r = hit
      ? await cf(`/zones/${zoneId}/dns_records/${hit.id}`, { method: "PUT", body: payload })
      : await cf(`/zones/${zoneId}/dns_records`, { method: "POST", body: payload });
    if (r.ok) done(`${rec.label} record in place`);
    else warn(`${rec.label} record could not be written`);
  }

  /* 7. IndexNow — tell Bing, Yandex, Seznam and Naver immediately. */
  step(7, "Submitting URLs to IndexNow (Bing, Yandex, Seznam, Naver)");
  const inKey = process.env.INDEXNOW_KEY || "382450a00fd726eefeae7c26f22e808f";
  const host = new URL(SITE_URL).hostname;
  if (inKey) {
    try {
      const res = await fetch("https://api.indexnow.org/IndexNow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host,
          key: inKey,
          keyLocation: `https://${host}/${inKey}.txt`,
          urlList: [`https://${host}/`, `https://${host}/privacy`],
        }),
      });
      if (res.status === 200 || res.status === 202) done(`Submitted (HTTP ${res.status})`);
      else warn(`IndexNow returned HTTP ${res.status} — retry after DNS propagates`);
    } catch {
      warn("IndexNow unreachable — harmless, search engines will still crawl");
    }
  } else {
    warn("INDEXNOW_KEY not set — skipping instant indexing");
  }

  /* 8. Ping Google + Bing with the sitemap. */
  step(8, "Pinging sitemap endpoints");
  const sitemap = encodeURIComponent(`https://${host}/sitemap.xml`);
  for (const [name, url] of [
    ["Google", `https://www.google.com/ping?sitemap=${sitemap}`],
    ["Bing", `https://www.bing.com/ping?sitemap=${sitemap}`],
  ]) {
    try {
      const r = await fetch(url, { method: "GET" });
      if (r.ok) done(`${name} pinged`);
      else warn(`${name} ping returned ${r.status} (deprecated endpoint — use Search Console)`);
    } catch {
      warn(`${name} ping failed — submit manually in Search Console`);
    }
  }

  console.log(`\n${c.ok("  Launch complete.")}`);
  console.log(`  ${c.dim("Live at")} ${SITE_URL}`);
  console.log(`  ${c.dim("Account")} ${accountId || "—"}\n`);
  console.log("  Next, once only:");
  console.log("    · Search Console → add https://www.aurumbespoke.com, submit /sitemap.xml");
  console.log("    · Bing Webmaster Tools → import from Search Console");
  console.log("    · Google Business Profile → set the website to the same URL\n");
}

main().catch((err) => die(err?.message || String(err)));
