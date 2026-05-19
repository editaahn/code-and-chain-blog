import type { BlogPost, BlogPostMeta } from "@/lib/blog";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const AUTHOR = {
  name: "Rita",
  alternateName: "Rita Ahn",
  githubUrl: "https://github.com/editaahn",
  linkedinUrl: "https://www.linkedin.com/in/rita-ahn",
} as const;

type BreadcrumbItem = {
  name: string;
  path: string;
};

function personSchema(locale: string) {
  return {
    "@type": "Person",
    name: AUTHOR.name,
    alternateName: AUTHOR.alternateName,
    url: absoluteUrl(locale, "/about"),
    sameAs: [AUTHOR.githubUrl, AUTHOR.linkedinUrl],
  };
}

function organizationSchema(locale: string) {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(locale),
    logo: {
      "@type": "ImageObject",
      url: `${absoluteUrl(locale)}/favicon.ico`,
    },
  };
}

export function buildWebSiteJsonLd(locale: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(locale),
    description,
    inLanguage: locale,
    publisher: personSchema(locale),
  };
}

export function buildBlogJsonLd(
  locale: string,
  description: string,
  posts: BlogPostMeta[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: SITE_NAME,
    url: absoluteUrl(locale, "/blog"),
    description,
    inLanguage: locale,
    publisher: personSchema(locale),
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: absoluteUrl(locale, `/blog/${post.slug}`),
      author: personSchema(locale),
    })),
  };
}

export function buildBlogPostingJsonLd(
  post: BlogPost,
  locale: string,
  breadcrumbs: BreadcrumbItem[],
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        url: absoluteUrl(locale, `/blog/${post.slug}`),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": absoluteUrl(locale, `/blog/${post.slug}`),
        },
        inLanguage: locale,
        author: personSchema(locale),
        publisher: organizationSchema(locale),
        keywords: post.tags.join(", "),
        articleSection: post.category,
        ...(post.subcategory ? { genre: post.subcategory } : {}),
      },
      buildBreadcrumbJsonLd(locale, breadcrumbs),
    ],
  };
}

export function buildCollectionPageJsonLd(
  locale: string,
  name: string,
  description: string,
  path: string,
  breadcrumbs: BreadcrumbItem[],
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name,
        description,
        url: absoluteUrl(locale, path),
        inLanguage: locale,
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl(locale),
        },
      },
      buildBreadcrumbJsonLd(locale, breadcrumbs),
    ],
  };
}

function buildBreadcrumbJsonLd(locale: string, items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}
