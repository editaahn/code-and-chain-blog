import { NextSeo, NextSeoProps } from "next-seo";
import { useLocale } from "next-intl";

interface SEOProps extends Omit<NextSeoProps, "languageAlternates"> {
  title: string;
  description: string;
  path?: string;
}

export function SEO({ title, description, path = "", ...props }: SEOProps) {
  const locale = useLocale();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://code-and-chain.vercel.app";

  const fullUrl = `${baseUrl}/${locale}${path}`;
  const alternateUrls = [
    {
      hrefLang: "ko",
      href: `${baseUrl}/ko${path}`,
    },
    {
      hrefLang: "en",
      href: `${baseUrl}/en${path}`,
    },
    {
      hrefLang: "x-default",
      href: `${baseUrl}/ko${path}`,
    },
  ];

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={fullUrl}
      languageAlternates={alternateUrls}
      openGraph={{
        title,
        description,
        url: fullUrl,
        type: "website",
        locale: locale,
        siteName: "Code & Chain",
      }}
      twitter={{
        cardType: "summary_large_image",
        site: "@codeandchain",
      }}
      additionalMetaTags={[
        {
          name: "author",
          content: "Code & Chain",
        },
        {
          name: "keywords",
          content:
            locale === "ko"
              ? "프론트엔드, 개발, 암호화폐, 블록체인, React, Next.js, 웹개발"
              : "frontend, development, cryptocurrency, blockchain, React, Next.js, web development",
        },
      ]}
      {...props}
    />
  );
}
