import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/config";
import { getAllArticlesByLocale } from "../lib/articles";
import { supabase } from "../lib/supabase";

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

  // Fetch article slugs from Supabase; fall back to static if unavailable.
  let articleSlugs: string[] = [];
  try {
    const { data } = await supabase
      .from("articles")
      .select("slug")
      .eq("is_published", true);
    if (data && data.length > 0) {
      articleSlugs = (data as { slug: string }[])
        .map((a) => a.slug)
        .filter(Boolean);
    }
  } catch {
    // Supabase unavailable at build time — proceed with static fallback below.
  }

  if (articleSlugs.length === 0) {
    articleSlugs = getAllArticlesByLocale("fa").map((a) => a.slug);
  }

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