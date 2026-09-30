import type { LucideIcon } from "lucide-react";

interface ContactInquiryCardProps {
  icon: LucideIcon;
  title: string;
  text: string;
}

export default function ContactInquiryCard({
  icon: Icon,
  title,
  text,
}: ContactInquiryCardProps) {
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
      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          border
          border-neutral-700
          bg-neutral-800
        "
      >
        <Icon className="h-5 w-5 text-neutral-300" />
      </div>

      <h3 className="mt-7 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-neutral-400">
        {text}
      </p>

      <div
        className="
          mt-7
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