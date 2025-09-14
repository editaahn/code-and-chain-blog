import { getTranslations } from "next-intl/server";
import { getPostsByCategory, getAllCategories } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  const koCategories = getAllCategories("ko");
  const enCategories = getAllCategories("en");

  return [
    ...koCategories.map((category) => ({ locale: "ko", category })),
    ...enCategories.map((category) => ({ locale: "en", category })),
  ];
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;
  const t = await getTranslations();
  const posts = getPostsByCategory(category, locale);

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case "crypto":
        return t("categories.crypto");
      case "tech":
        return t("categories.product-development");
      case "frontend":
        return t("categories.frontend");
      default:
        return cat;
    }
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
        <p className="text-xl text-muted-foreground">
          {category === "crypto"
            ? "암호화폐와 블록체인 기술에 대한 분석과 인사이트"
            : "프론트엔드 개발과 기술 트렌드에 대한 글들"}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            이 카테고리에는 아직 글이 없습니다. 곧 업데이트될 예정입니다! 🚀
          </p>
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
