// src/components/blog/BlogGrid.tsx
import BlogCard from "./BlogCard";
import type { BlogPost } from "../../types/blog";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-8
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
