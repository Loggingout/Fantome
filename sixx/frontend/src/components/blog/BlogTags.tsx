// src/components/blog/BlogTags.tsx
interface BlogTagsProps {
  tags: string[];
  onSelect: (tag: string) => void;
}

export default function BlogTags({ tags, onSelect }: BlogTagsProps) {
  return (
    <div
      className="
        w-full flex flex-wrap gap-3
        sm:gap-3
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {tags.map((tag) => {
        return (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className={`
              px-4 py-2 rounded-xl text-sm
              border transition
              whitespace-nowrap
              bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white
            `}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
}
