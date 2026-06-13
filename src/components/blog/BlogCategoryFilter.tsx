// src/components/blog/BlogCategoryFilter.tsx
import React, { useState } from "react";

const CATEGORIES = [
  "All",
  "Technology",
  "Design",
  "Business",
  "AI",
  "Development",
  "Culture",
];

export default function BlogCategoryFilter() {
  const [active, setActive] = useState("All");

  return (
    <div
      className="
        w-full overflow-x-auto no-scrollbar
        flex gap-3 py-2
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;

        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-xl text-sm
              border transition
              ${
                isActive
                  ? "bg-white text-black border-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }
            `}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
