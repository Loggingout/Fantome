// src/components/blog/BlogSearch.tsx
import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function BlogSearch() {
  const [query, setQuery] = useState("");

  return (
    <div
      className="
        w-full bg-neutral-900 border border-neutral-800
        rounded-2xl p-3 flex items-center gap-3
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Search Icon */}
      <FiSearch className="text-neutral-500 text-xl shrink-0" />

      {/* Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="
          flex-1 bg-transparent text-white text-sm sm:text-base
          placeholder-neutral-500 focus:outline-none
        "
      />

      {/* Clear Button */}
      {query.length > 0 && (
        <button
          onClick={() => setQuery("")}
          className="text-neutral-500 hover:text-neutral-300 transition"
        >
          <FiX className="text-lg" />
        </button>
      )}
    </div>
  );
}
