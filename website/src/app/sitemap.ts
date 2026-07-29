import type { MetadataRoute } from "next";
import { CONFIG, COLLECTIONS, PORTFOLIO } from "@/site/lib/site";

export const dynamic = "force-static";

/**
 * Only canonical, indexable URLs belong in a sitemap. Hash fragments are not
 * separate documents — listing them makes a sitemap look like duplicate
 * content and dilutes crawl budget, so the homepage is declared once and
 * enriched with an image sitemap for Google Images discovery.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const images = [
    `${CONFIG.websiteUrl}/brand/og-image.jpg`,
    ...COLLECTIONS.map((c) => c.image),
    ...PORTFOLIO.map((p) => p.image),
  ];

  return [
    {
      url: `${CONFIG.websiteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images,
    },
    {
      url: `${CONFIG.websiteUrl}/privacy/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
