import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, TrendingUp } from "lucide-react";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 mb-20">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Code & Chain
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t("seo.description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/blog">
              {t("blog.title")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="grid md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">{t("categories.crypto")}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            암호화폐 시장 동향, 이슈 분석, 그리고 블록체인 기술에 대한 깊이 있는
            해부
          </p>
          <div className="space-y-2">
            <Link
              href={{
                pathname: "/category/[category]",
                params: { category: "crypto" },
              }}
              className="block text-sm text-blue-600 hover:underline"
            >
              → {t("categories.crypto-issues")}
            </Link>
            <Link
              href={{
                pathname: "/category/[category]",
                params: { category: "crypto" },
              }}
              className="block text-sm text-blue-600 hover:underline"
            >
              → {t("categories.crypto-tech")}
            </Link>
          </div>
        </div>

        <div className="p-8 rounded-lg border bg-card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Code className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold">{t("categories.tech")}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            프론트엔드 개발 트렌드, 기술 분석, 그리고 개발 경험 공유
          </p>
          <div className="space-y-2">
            <Link
              href={{
                pathname: "/category/[category]",
                params: { category: "tech" },
              }}
              className="block text-sm text-purple-600 hover:underline"
            >
              → {t("categories.frontend")}
            </Link>
            <Link
              href={{
                pathname: "/category/[category]",
                params: { category: "tech" },
              }}
              className="block text-sm text-purple-600 hover:underline"
            >
              → {t("categories.etc")}
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

        <div className="text-center text-muted-foreground py-12">
          곧 흥미로운 콘텐츠들이 업데이트될 예정입니다! 🚀
        </div>
      </section>
    </div>
  );
}
