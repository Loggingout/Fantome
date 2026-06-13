// src/components/blog/RecentPosts.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const RECENT_POSTS = [
  {
    id: "1",
    title: "Designing for the Future: Fantome’s UI Philosophy",
    date: "May 18, 2026",
  },
  {
    id: "2",
    title: "AI and Creativity: Blending Art with Engineering",
    date: "May 15, 2026",
  },
  {
    id: "3",
    title: "Building Scalable Web Apps with Modern Architecture",
    date: "May 10, 2026",
  },
];

export default function RecentPosts() {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col gap-5"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {RECENT_POSTS.map((post) => (
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
            {post.date}
          </span>

          {/* Divider */}
          <div className="w-full h-px bg-neutral-800 mt-3 group-last:hidden" />
        </button>
      ))}
    </div>
  );
}
