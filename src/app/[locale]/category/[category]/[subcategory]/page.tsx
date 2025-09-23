import { getTranslations } from "next-intl/server";
import {
  getPostsByCategory,
  getSubcategories,
  getAllCategories,
} from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Folder } from "lucide-react";

interface SubcategoryPageProps {
  params: Promise<{ locale: string; category: string; subcategory: string }>;
}

export async function generateStaticParams() {
  const allCategories = getAllCategories();

  const params: { locale: string; category: string; subcategory: string }[] =
    [];

  // Generate params for Korean content
  allCategories.forEach((category) => {
    const subcategories = getSubcategories(category);
    subcategories.forEach((subcategory) => {
      params.push(
        { locale: "ko", category, subcategory },
        { locale: "en", category, subcategory }
      );
    });
  });

  return params;
}

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { locale, category, subcategory } = await params;
  const t = await getTranslations();
  const posts = getPostsByCategory(category, locale, subcategory);

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case "crypto":
        return t("categories.crypto");
      case "product-development":
        return t("categories.product-development");
      case "frontend":
        return t("categories.frontend");
      default:
        return cat;
    }
  };

  const getSubcategoryTitle = (subcat: string) => {
    return t(`categories.${subcat}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-wrap gap-4">
        <Button variant="ghost" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToHome")}
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link
            href={{
              pathname: "/category/[category]",
              params: { category },
            }}
            className="gap-2"
          >
            <Folder className="h-4 w-4" />
            {getCategoryTitle(category)}
          </Link>
        </Button>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link
            href={{
              pathname: "/category/[category]",
              params: { category },
            }}
            className="hover:text-foreground transition-colors"
          >
            {getCategoryTitle(category)}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {getSubcategoryTitle(subcategory)}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          {getSubcategoryTitle(subcategory)}
        </h1>
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
