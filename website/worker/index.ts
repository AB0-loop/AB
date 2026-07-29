/**
 * Aurum Bespoke — Cloudflare Worker.
 *
 * Serves the statically exported site straight from Cloudflare's edge and
 * handles the two API endpoints. Secrets (the Web3Forms key) live in Worker
 * secrets, never in the bundle or the repository.
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  /** Optional sink for enquiry records (KV worker, Zapier, n8n, Sheets…). */
  BOOKING_WEBHOOK_URL?: string;
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function handleBooking(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request" }, 400);
  }

  // Honeypot — accept silently so bots learn nothing.
  if (clean(body.company, 80)) return json({ ok: true, id: null }, 201);

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const city = clean(body.city, 160);
  const requirement = clean(body.requirement, 160);
  const email = clean(body.email, 160);

  if (!name || !phone || !city || !requirement) {
    return json({ ok: false, error: "Please complete the required fields." }, 422);
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return json({ ok: false, error: "Invalid phone number." }, 422);
  }

  // Email delivery happens in the browser via Web3Forms. This endpoint exists
  // so the site keeps a durable acknowledgement path and can be extended with
  // a KV / D1 / webhook sink without touching the front-end.
  const sink = env.BOOKING_WEBHOOK_URL;
  if (sink) {
    await fetch(sink, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email: email || null,
        city,
        preferredDate: clean(body.preferredDate, 40) || null,
        requirement,
        source: clean(body.source, 40) || "website",
        receivedAt: new Date().toISOString(),
      }),
    }).catch(() => undefined);
  }

  return json({ ok: true }, 201);
}

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Canonical host is the APEX — that is what the live site serves today and
    // what Google has indexed. www folds into it so link equity never splits.
    if (url.hostname === "www.aurumbespoke.com") {
      url.hostname = "aurumbespoke.com";
      return Response.redirect(url.toString(), 301);
    }

    // Paths the previous sitemap advertised. They 404 on the old site today,
    // so anything Google or a backlink still points at is recovered here
    // instead of dying. 301 keeps whatever equity they hold.
    const LEGACY: Record<string, string> = {
      "/about": "/#story",
      "/services": "/#collections",
      "/collections": "/#collections",
      "/portfolio": "/#portfolio",
      "/process": "/#process",
      "/faq": "/#faq",
      "/contact": "/#contact",
      "/booking": "/#booking",
      "/book": "/#booking",
      "/index.html": "/",
    };
    const legacy = LEGACY[url.pathname.replace(/\/+$/, "") || "/"];
    if (legacy) {
      return Response.redirect(new URL(legacy, url.origin).toString(), 301);
    }

    if (url.pathname === "/api/bookings") {
      const res = await handleBooking(request, env);
      const headers = new Headers(res.headers);
      headers.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(res.body, { status: res.status, headers });
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, runtime: "cloudflare-workers" });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const headers = new Headers(assetResponse.headers);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);

    // Long-lived immutable caching for fingerprinted build output and brand art.
    if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/brand/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  },
};

export default handler;
