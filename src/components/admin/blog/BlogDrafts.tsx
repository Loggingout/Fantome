import React from "react";

const MOCK_DRAFTS = [
  { id: "1", title: "Why Fantome Uses Tailwind", updated: "2 days ago" },
  { id: "2", title: "Understanding React Server Components", updated: "5 days ago" },
];

export default function BlogDrafts() {
  return (
    <div
      className="
        bg-neutral-900 border border-neutral-800
        rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <p className="text-neutral-500 text-xs tracking-widest uppercase mb-3">
        Drafts
      </p>

      <div className="space-y-3">
        {MOCK_DRAFTS.map((draft) => (
          <div
            key={draft.id}
            className="
              flex flex-col sm:flex-row sm:justify-between
              gap-1 sm:gap-0
            "
          >
            <span className="text-white text-sm">{draft.title}</span>
            <span className="text-neutral-500 text-xs">{draft.updated}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
