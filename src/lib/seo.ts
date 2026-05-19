import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_NAME = "Code & Chain";

export function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://code-and-chain-rita.xyz" ||
    "https://code-and-chain-blog.vercel.app"
  );
}

export function localePath(locale: string, path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: string, path = ""): string {
  return `${getBaseUrl()}${localePath(locale, path)}`;
}

export function buildLanguageAlternates(
  path = "",
  locales: readonly string[] = routing.locales,
): NonNullable<Metadata["alternates"]> {
  return { languages: buildLanguageMap(path, locales) };
}

export function buildSitemapAlternates(
  path = "",
  locales: readonly string[] = routing.locales,
): { languages: Record<string, string> } {
  return { languages: buildLanguageMap(path, locales) };
}

function buildLanguageMap(
  path: string,
  locales: readonly string[],
): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = absoluteUrl(locale, path);
  }

  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);

  return languages;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  locale: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  alternateLocales?: readonly string[];
};

export function buildPageMetadata({
  title,
  description,
  locale,
  path = "",
  type = "website",
  publishedTime,
  tags,
  alternateLocales,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...buildLanguageAlternates(path, alternateLocales),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags && tags.length > 0 ? { tags } : {}),
    },
  };
}
