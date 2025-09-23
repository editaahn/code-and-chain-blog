import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Code, TrendingUp } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import LatestPosts from "@/components/blog/latest-posts";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 mb-20">
        <div className="space-y-4">
          <h1 className="mx-auto w-fit text-4xl md:text-6xl font-bold bg-gradient-to-r from-zinc-800 via-zinc-400 to-rose-700 bg-clip-text text-transparent">
            Code & Chain
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t("seo.description")}
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="grid md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-900/20">
              <TrendingUp className="h-8 w-8 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold">{t("categories.crypto")}</h2>
          </div>
          <div className="space-y-2">
            {CATEGORIES.crypto.map((subcategory) => (
              <Link
                key={subcategory}
                href={{
                  pathname: "/category/[category]/[subcategory]",
                  params: { category: "crypto", subcategory },
                }}
                className="block text-sm text-rose-600 hover:underline"
              >
                → {t(`categories.${subcategory}`)}
              </Link>
            ))}
            <Link
              href={{
                pathname: "/category/[category]",
                params: { category: "crypto" },
              }}
              className="block text-sm text-rose-600 hover:underline"
            >
              → {t("blog.allPosts")}
            </Link>
          </div>
        </div>

        <div className="p-8 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-900/20">
              <Code className="h-8 w-8 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold">
              {t("categories.product-development")}
            </h2>
          </div>
          <div className="space-y-2">
            {CATEGORIES["product-development"].map((subcategory) => (
              <Link
                key={subcategory}
                href={{
                  pathname: "/category/[category]/[subcategory]",
                  params: { category: "tech", subcategory },
                }}
                className="block text-sm text-rose-600 hover:underline"
              >
                → {t(`categories.${subcategory}`)}
              </Link>
            ))}
            <Link
              href={{
                pathname: "/category/[category]",
                params: { category: "product-development" },
              }}
              className="block text-sm text-rose-600 hover:underline"
            >
              → {t("blog.allPosts")}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{t("blog.latestPosts")}</h2>
          <Button variant="outline" asChild>
            <Link href="/blog">{t("blog.allPosts")}</Link>
          </Button>
        </div>

        <LatestPosts locale={locale} limit={3} />
      </section>
    </div>
  );
}
