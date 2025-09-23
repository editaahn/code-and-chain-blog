import { getTranslations } from "next-intl/server";
import {
  getPostsByCategory,
  getAllCategories,
  getSubcategories,
} from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Folder } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  const allCategories = getAllCategories();

  return [
    ...allCategories.map((category) => ({ locale: "ko", category })),
    ...allCategories.map((category) => ({ locale: "en", category })),
  ];
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;
  const t = await getTranslations();
  const posts = getPostsByCategory(category, locale);
  const subcategories = getSubcategories(category);

  const getCategoryTitle = (cat: string) => {
    return t(`categories.${cat}`);
  };

  const getSubcategoryTitle = (subcat: string) => {
    return t(`categories.${subcat}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToHome")}
          </Link>
        </Button>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {getCategoryTitle(category)}
        </h1>

        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Folder className="h-5 w-5" />
              {t("blog.subcategories")}
            </h2>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory}
                  href={{
                    pathname: "/category/[category]/[subcategory]",
                    params: { category, subcategory },
                  }}
                >
                  <Badge
                    variant="secondary"
                    className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {getSubcategoryTitle(subcategory)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t("blog.soon")}</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
