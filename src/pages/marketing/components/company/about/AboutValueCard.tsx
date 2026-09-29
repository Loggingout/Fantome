import type { LucideIcon } from "lucide-react";

interface AboutValueCardProps {
  icon: LucideIcon;
  title: string;
  text: string;
  tag: string;
}

export default function AboutValueCard({
  icon: Icon,
  title,
  text,
  tag,
}: AboutValueCardProps) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-neutral-800
        bg-neutral-900
        p-7
        transition-all
        duration-300
        hover:border-neutral-700
      "
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border border-neutral-700
            bg-neutral-800
          "
        >
          <Icon className="h-5 w-5 text-neutral-300" />
        </span>

        <span className="text-xs font-medium tracking-[0.2em] text-neutral-600">
          {tag}
        </span>
      </div>

      <h3 className="mt-8 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-neutral-400">
        {text}
      </p>

      <div
        className="
          mt-8
          h-px
          w-10
          bg-neutral-700
          transition-all
          duration-300
          group-hover:w-16
        "
      />
    </article>
  );
}