// src/components/blog/BlogTags.tsx
import React, { useState } from "react";

const TAGS = [
  "UI/UX",
  "AI",
  "Engineering",
  "Design",
  "Business",
  "Culture",
  "Frontend",
  "Backend",
  "Branding",
  "Strategy",
];

export default function BlogTags() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className="
        w-full flex flex-wrap gap-3
        sm:gap-3
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {TAGS.map((tag) => {
        const isActive = active === tag;

        return (
          <button
            key={tag}
            onClick={() => setActive(isActive ? null : tag)}
            className={`
              px-4 py-2 rounded-xl text-sm
              border transition
              whitespace-nowrap
              ${
                isActive
                  ? "bg-white text-black border-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }
            `}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
}
