import type { MetadataRoute } from "next";
import { CONFIG } from "@/site/lib/site";

export const dynamic = "force-static";

/** Search crawlers — full access to content, none to endpoints. */
const SEARCH_CRAWLERS = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "Slurp",
  "Applebot",
  "YandexBot",
];

/** Answer engines & AI assistants — explicitly welcomed (AEO / GEO). */
const ANSWER_ENGINES = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "MistralAI-User",
  "cohere-ai",
];

/** Aggressive SEO scrapers that only cost bandwidth. */
const BLOCKED = ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "PetalBot", "DataForSeoBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/thank-you", "/thank-you/"],
      },
      {
        userAgent: SEARCH_CRAWLERS,
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ANSWER_ENGINES,
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: BLOCKED,
        disallow: "/",
      },
    ],
    sitemap: `${CONFIG.websiteUrl}/sitemap.xml`,
    host: CONFIG.websiteUrl,
  };
}
