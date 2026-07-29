import type { NextConfig } from "next";

/**
 * DEPLOY_TARGET=static produces the pre-rendered `out/` directory that the
 * Cloudflare Worker serves from the edge. Unset, it builds the normal Node
 * server used in development and on any Node host.
 */
const isStatic = process.env.DEPLOY_TARGET === "static";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  ...(isStatic ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    // Cloudflare serves the export as plain files; Next's optimiser is not present.
    unoptimized: isStatic,
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Crawl files must always be fresh, cacheable at the edge, and indexable.
      {
        source: "/:file(sitemap.xml|robots.txt|llms.txt|manifest.webmanifest)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
          { key: "X-Robots-Tag", value: "all" },
        ],
      },
      // Never let form endpoints be cached or indexed.
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default isStatic
  ? { ...nextConfig, headers: undefined }
  : nextConfig;
