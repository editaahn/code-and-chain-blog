import { BlogCard } from "@/components/blog/blog-card";
import { getAllPosts } from "@/lib/blog";

interface LatestPostsProps {
  locale: string;
  limit?: number;
}

export default async function LatestPosts({
  locale,
  limit = 3,
}: LatestPostsProps) {
  const posts = getAllPosts(locale).slice(0, limit);

  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Soon interesting contents will be updated! 🚀
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
