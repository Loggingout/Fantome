import { useNavigate } from "react-router-dom";
import type { BlogPost } from "../../types/blog";

export default function RecentPosts({ posts }: { posts: BlogPost[] }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col gap-5"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {posts.slice(0, 5).map((post) => (
        <button
          key={post.id}
          onClick={() => navigate(`/blog/${post.id}`)}
          className="
            text-left group
            flex flex-col gap-1
            transition
          "
        >
          {/* Title */}
          <span
            className="
              text-white text-sm font-semibold leading-snug
              group-hover:text-neutral-300 transition
            "
          >
            {post.title}
          </span>

          {/* Date */}
          <span className="text-neutral-500 text-xs">
            {post.publishedAt || post.createdAt
              ? new Date(post.publishedAt ?? post.createdAt ?? "").toLocaleDateString()
              : "Recently published"}
          </span>

          {/* Divider */}
          <div className="w-full h-px bg-neutral-800 mt-3 group-last:hidden" />
        </button>
      ))}
    </div>
  );
}
