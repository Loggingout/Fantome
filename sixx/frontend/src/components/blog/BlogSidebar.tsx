// src/components/blog/BlogSidebar.tsx
import React from "react";
import RecentPosts from "./RecentPosts";
import BlogTags from "./BlogTags";

export default function BlogSidebar() {
  return (
    <aside
      className="
        w-full flex flex-col gap-8
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Recent Posts */}
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        "
      >
        <h3 className="text-white text-lg font-semibold mb-4">
          Recent Posts
        </h3>
        <RecentPosts />
      </div>

      {/* Tags */}
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        "
      >
        <h3 className="text-white text-lg font-semibold mb-4">
          Tags
        </h3>
        <BlogTags />
      </div>

      {/* Optional Newsletter Box */}
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
          flex flex-col gap-4
        "
      >
        <h3 className="text-white text-lg font-semibold">
          Stay Updated
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Get the latest articles, insights, and updates from Fantome delivered straight to your inbox.
        </p>

        <input
          type="email"
          placeholder="Your email"
          className="
            w-full px-4 py-2 rounded-xl
            bg-neutral-800 border border-neutral-700
            text-white placeholder-neutral-500
            focus:outline-none
          "
        />

        <button
          className="
            w-full px-4 py-2 rounded-xl
            bg-white text-black font-semibold text-sm
            hover:bg-neutral-200 transition
          "
        >
          Subscribe
        </button>
      </div>
    </aside>
  );
}
