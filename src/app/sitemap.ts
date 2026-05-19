import type { MetadataRoute } from "next";
import { getAllPosts, getAllCategories, getSubcategories } from "@/lib/blog";
import { routing } from "@/i18n/routing";
import { absoluteUrl, buildSitemapAlternates } from "@/lib/seo";

const STATIC_PATHS = ["", "/about", "/blog"] as const;

function getUniquePostSlugs(): string[] {
  const slugs = new Set<string>();

  for (const locale of routing.locales) {
    for (const post of getAllPosts(locale)) {
      slugs.add(post.slug);
    }
  }

  return [...slugs];
}

function getPostLocales(slug: string): string[] {
  return routing.locales.filter((locale) =>
    getAllPosts(locale).some((post) => post.slug === slug),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: buildSitemapAlternates(path),
      });
    }
  }

  for (const category of getAllCategories()) {
    const path = `/category/${category}`;

    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(locale, path),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: buildSitemapAlternates(path),
      });
    }

    for (const subcategory of getSubcategories(category)) {
      const subPath = `/category/${category}/${subcategory}`;

      for (const locale of routing.locales) {
        entries.push({
          url: absoluteUrl(locale, subPath),
          changeFrequency: "weekly",
          priority: 0.6,
          alternates: buildSitemapAlternates(subPath),
        });
      }
    }
  }

  for (const slug of getUniquePostSlugs()) {
    const postLocales = getPostLocales(slug);
    const posts = postLocales.flatMap((locale) =>
      getAllPosts(locale).filter((post) => post.slug === slug),
    );
    const latestModified = posts.reduce((latest, post) => {
      const postDate = new Date(post.date);
      return postDate > latest ? postDate : latest;
    }, new Date(0));

    for (const locale of postLocales) {
      const path = `/blog/${slug}`;

      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: latestModified,
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: buildSitemapAlternates(path, postLocales),
      });
    }
  }

  return entries;
}
