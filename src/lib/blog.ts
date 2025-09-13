import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  subcategory?: string;
  tags: string[];
  locale: string;
  content: string;
  readingTime: string;
  published: boolean;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  subcategory?: string;
  tags: string[];
  locale: string;
  readingTime: string;
  published: boolean;
}

const contentDirectory = path.join(process.cwd(), "content/blog");

export function getAllPosts(locale: string): BlogPostMeta[] {
  const localeDir = path.join(contentDirectory, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(localeDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        category: data.category || "",
        subcategory: data.subcategory,
        tags: data.tags || [],
        locale,
        readingTime: readingTime(content).text,
        published: data.published !== false,
      };
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, locale, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    if (data.published === false) {
      return null;
    }

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      category: data.category || "",
      subcategory: data.subcategory,
      tags: data.tags || [],
      locale,
      content,
      readingTime: readingTime(content).text,
      published: data.published !== false,
    };
  } catch {
    return null;
  }
}

export function getPostsByCategory(
  category: string,
  locale: string,
  subcategory?: string
): BlogPostMeta[] {
  const posts = getAllPosts(locale);
  return posts.filter((post) => {
    if (subcategory) {
      return post.category === category && post.subcategory === subcategory;
    }
    return post.category === category;
  });
}

export function getAllCategories(locale: string): string[] {
  const posts = getAllPosts(locale);
  const categories = [...new Set(posts.map((post) => post.category))];
  return categories;
}

export function getAllTags(locale: string): string[] {
  const posts = getAllPosts(locale);
  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  return tags;
}
