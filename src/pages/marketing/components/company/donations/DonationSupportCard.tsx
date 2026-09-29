interface DonationSupportCardProps {
  title: string;
  description: string;
  number: string;
}

export default function DonationSupportCard({
  title,
  description,
  number,
}: DonationSupportCardProps) {
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
        <span className="text-xs font-medium tracking-[0.2em] text-neutral-600">
          {number}
        </span>

        <div className="h-px w-8 bg-neutral-700 transition-all duration-300 group-hover:w-12" />
      </div>

      <h3 className="mt-8 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-neutral-400">
        {description}
      </p>
    </article>
  );
}