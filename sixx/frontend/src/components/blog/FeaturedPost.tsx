import { useNavigate } from "react-router-dom";
import type { BlogPost } from "../../types/blog";

export default function FeaturedPost({ post }: { post: BlogPost | null }) {
  const navigate = useNavigate();

  if (!post) return null;

  return (
    <div
      className="
        bg-neutral-900 border border-neutral-800
        rounded-2xl overflow-hidden
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        w-full
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Image */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96">
        <img
          src={post.image || "/new-logo.png"}
          alt={post.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex flex-col gap-4">
        {/* Category + Date */}
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="uppercase tracking-widest">{post.category}</span>
          <span className="text-neutral-600">•</span>
          <span>
            {post.publishedAt || post.createdAt
              ? new Date(post.publishedAt ?? post.createdAt ?? "").toLocaleDateString()
              : "Recently published"}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          {post.excerpt}
        </p>

        {/* Read More */}
        <button
          onClick={() => navigate(`/blog/${post.id}`)}
          className="
            mt-2 w-fit px-5 py-2 rounded-xl
            bg-white text-black text-sm font-semibold
            hover:bg-neutral-200 transition
          "
        >
          Read More
        </button>
      </div>
    </div>
  );
}
