import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, Linkedin } from "lucide-react";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return { title: t("metaTitle") };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");
  const tCommon = await getTranslations("common");
  const githubUrl = t("githubUrl").trim();
  const linkedinUrl = t("linkedinUrl").trim();
  const hasSocial = githubUrl !== "" || linkedinUrl !== "";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {tCommon("backToHome")}
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1
          className={
            hasSocial ? "text-4xl font-bold mb-6" : "text-4xl font-bold mb-10"
          }
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 via-zinc-400 to-rose-700">
            About Rita
          </span>
        </h1>
        {hasSocial && (
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {githubUrl !== "" && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground/80 transition-colors hover:border-rose-500/50 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                aria-label="GitHub profile"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {linkedinUrl !== "" && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground/80 transition-colors hover:border-rose-500/50 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t("p1")}
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground mt-6">
            {t("p2")}
          </p>
        </article>
      </div>
    </div>
  );
}
