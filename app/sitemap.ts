import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/config";
import { getArticleSlugs } from "../lib/articles";

const LOCALES = ["fa", "en", "ps"] as const;
const DOCTOR_SLUG =
  process.env.NEXT_PUBLIC_DOCTOR_SLUG || "mohibullah-ahmadzai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Locale home pages
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  // Doctor profile pages
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/doctor/${DOCTOR_SLUG}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Articles archive pages
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  const articleSlugs = await getArticleSlugs(50);

  // Individual article pages
  for (const slug of articleSlugs) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/articles/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}