import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
  pathnames: {
    "/": "/",
    "/about": "/about",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/category/[category]": "/category/[category]",
    "/category/[category]/[subcategory]": "/category/[category]/[subcategory]",
  },
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
