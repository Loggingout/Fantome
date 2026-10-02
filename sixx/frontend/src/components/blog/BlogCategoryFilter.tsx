// src/components/blog/BlogCategoryFilter.tsx
interface BlogCategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function BlogCategoryFilter({
  categories,
  activeCategory,
  onChange,
}: BlogCategoryFilterProps) {

  return (
    <div
      className="
        w-full overflow-x-auto no-scrollbar
        flex gap-3 py-2
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
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
