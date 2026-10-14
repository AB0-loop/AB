/**
 * Aurum Bespoke — Cloudflare Worker.
 *
 * Serves the statically exported site straight from Cloudflare's edge and
 * handles the two API endpoints. Secrets live in Worker secrets, never in the
 * bundle or the repository.
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  BOOKING_WEBHOOK_URL?: string;
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

const ROBOTS = `User-agent: Googlebot
User-agent: Googlebot-Image
User-agent: Bingbot
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: Google-Extended
Allow: /
Disallow: /api/

User-agent: *
Allow: /
Disallow: /api/
Disallow: /thank-you
Disallow: /thank-you/

Host: https://aurumbespoke.com
Sitemap: https://aurumbespoke.com/sitemap.xml
`;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      ...SECURITY_HEADERS,
    },
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

  if (clean(body.company, 80)) return json({ ok: true, id: null }, 201);

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const city = clean(body.city, 160) || clean(body.area, 160);
  const requirement = clean(body.requirement, 160) || clean(body.service, 160);
  const email = clean(body.email, 160);

  if (!name || !phone || !city || !requirement) {
    return json({ ok: false, error: "Please complete the required fields." }, 422);
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return json({ ok: false, error: "Invalid phone number." }, 422);
  }

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

const LEGACY: Record<string, string> = {
  "/collections": "/services/bespoke-suits-bangalore/",
  "/portfolio": "/#portfolio",
  "/gallery": "/#portfolio",
  "/process": "/about/",
  "/faq": "/contact/",
  "/book": "/booking/",
  "/index.html": "/",
};

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.protocol === "http:" || url.hostname === "www.aurumbespoke.com") {
      url.protocol = "https:";
      if (url.hostname === "www.aurumbespoke.com") url.hostname = "aurumbespoke.com";
      return Response.redirect(url.toString(), 301);
    }

    const bare = url.pathname.replace(/\/+$/, "") || "/";
    if (LEGACY[bare]) {
      const destination = new URL(LEGACY[bare], url.origin);
      destination.search = url.search;
      return Response.redirect(destination.toString(), 301);
    }

    if (url.pathname === "/robots.txt") {
      return new Response(ROBOTS, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=300, s-maxage=3600",
          "X-Robots-Tag": "all",
          ...SECURITY_HEADERS,
        },
      });
    }

    if (url.pathname === "/api/bookings" || url.pathname === "/api/bookings/") {
      const res = await handleBooking(request, env);
      const headers = new Headers(res.headers);
      headers.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(res.body, { status: res.status, headers });
    }

    if (url.pathname === "/api/health" || url.pathname === "/api/health/") {
      return json({ ok: true, runtime: "cloudflare-workers" });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const headers = new Headers(assetResponse.headers);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value);

    if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/brand/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    if (
      [
        "/sitemap.xml",
        "/llms.txt",
        "/llms-full.txt",
        "/brand.json",
        "/entity.json",
        "/manifest.webmanifest",
      ].includes(url.pathname)
    ) {
      headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
      headers.set("X-Robots-Tag", "all");
    }

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  },
};

export default handler;
