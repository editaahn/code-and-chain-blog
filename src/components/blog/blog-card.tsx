import { Link } from "@/i18n/routing";
import { BlogPostMeta } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group">
      <div className="h-full p-6 border rounded-lg hover:shadow-lg transition-shadow bg-card">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(
                  post.locale === "ko" ? "ko-KR" : "en-US",
                )}
              </time>
              <Clock className="h-4 w-4 ml-2" />
              <span>{post.readingTime}</span>
            </div>

            <Link
              href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
            >
              <h2 className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                {post.title}
              </h2>
            </Link>
          </div>

          <Link
            href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
          >
            <p className="text-muted-foreground line-clamp-3 cursor-pointer">
              {post.description}
            </p>
          </Link>

          <div className="flex flex-wrap gap-2 mt-2">
            <Link
              href={{
                pathname: "/category/[category]",
                params: { category: post.category },
              }}
            >
              <Badge
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {post.category}
              </Badge>
            </Link>
            {post.subcategory && (
              <Link
                href={{
                  pathname: "/category/[category]/[subcategory]",
                  params: {
                    category: post.category,
                    subcategory: post.subcategory,
                  },
                }}
              >
                <Badge
                  variant="outline"
                  className="hover:bg-secondary transition-colors cursor-pointer"
                >
                  {post.subcategory}
                </Badge>
              </Link>
            )}
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
