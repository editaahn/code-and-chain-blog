import { Link } from "@/i18n/routing";
import { BlogPostMeta } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group cursor-pointer">
      <Link href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}>
        <div className="h-full p-6 border rounded-lg hover:shadow-lg transition-shadow bg-card">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(
                    post.locale === "ko" ? "ko-KR" : "en-US"
                  )}
                </time>
                <Clock className="h-4 w-4 ml-2" />
                <span>{post.readingTime}</span>
              </div>

              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
            </div>

            <p className="text-muted-foreground line-clamp-3">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              {post.subcategory && (
                <Badge variant="outline">{post.subcategory}</Badge>
              )}
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
