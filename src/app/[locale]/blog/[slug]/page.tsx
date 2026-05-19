import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { MDXContent } from "@/components/blog/mdx-content";
import { TocIndicator } from "@/components/blog/toc-indicator";
import { buildPageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const koPosts = getAllPosts("ko");
  const enPosts = getAllPosts("en");

  return [
    ...koPosts.map((post) => ({ locale: "ko", slug: post.slug })),
    ...enPosts.map((post) => ({ locale: "en", slug: post.slug })),
  ];
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return {};
  }

  const alternateLocales = routing.locales.filter(
    (availableLocale) => getPostBySlug(slug, availableLocale) !== null,
  );

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    locale,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
    alternateLocales,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("blog");
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <TocIndicator label={locale === "ko" ? "목차" : "Contents"} />

        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("allPosts")}
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-12 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground">{post.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(
                  post.locale === "ko" ? "ko-KR" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{post.category}</Badge>
            {post.subcategory && (
              <Badge variant="secondary">{post.subcategory}</Badge>
            )}
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent content={post.content} />
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="text-center">
            <Button asChild>
              <Link href="/blog">{t("allPosts")}</Link>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
