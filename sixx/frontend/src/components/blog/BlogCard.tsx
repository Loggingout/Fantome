// src/components/blog/BlogCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BlogCard({ post }: { post: any }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-neutral-900 border border-neutral-800
        rounded-2xl overflow-hidden
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        flex flex-col
        hover:scale-[1.02] hover:shadow-[0_12px_50px_rgba(0,0,0,0.45)]
        transition-transform duration-300
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Image */}
      <div className="relative w-full h-44 sm:h-48 md:h-52">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category + Date */}
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="uppercase tracking-widest">{post.category}</span>
          <span className="text-neutral-600">•</span>
          <span>{post.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-white text-lg font-semibold leading-snug">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Read More */}
        <button
          onClick={() => navigate(`/blog/${post.id}`)}
          className="
            mt-auto w-fit px-4 py-2 rounded-xl
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
