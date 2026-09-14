import type { MetadataRoute } from "next";
import {
  CONFIG,
  JOURNAL_PAGES,
  LOCATION_PAGES,
  SERVICE_PAGES,
} from "@/site/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/about/", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact/", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/booking/", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/privacy/", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  return [
    ...fixed.map((item) => ({
      url: `${CONFIG.websiteUrl}${item.path}`,
      priority: item.priority,
      changeFrequency: item.changeFrequency,
    })),
    ...SERVICE_PAGES.map((item) => ({
      url: `${CONFIG.websiteUrl}/services/${item.slug}/`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
    })),
    ...LOCATION_PAGES.map((item) => ({
      url: `${CONFIG.websiteUrl}/locations/${item.slug}/`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...JOURNAL_PAGES.map((item) => ({
      url: `${CONFIG.websiteUrl}/journal/${item.slug}/`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];
}
