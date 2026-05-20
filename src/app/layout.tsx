import type { Metadata } from "next";
import { getBaseUrl, SITE_NAME } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: `${SITE_NAME} - Product Development & Crypto Blog`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A personal blog providing in-depth analysis and insights on product development and cryptocurrency technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
