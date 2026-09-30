import type { PlatformStatusRecord } from "../../../data/status.data";
import { statusDefinitions } from "../../../data/status.data";

interface PlatformStatusCardProps {
  platform: PlatformStatusRecord;
}

export default function PlatformStatusCard({
  platform,
}: PlatformStatusCardProps) {
  const definition = statusDefinitions[platform.status];
  const Icon = definition.icon;

  return (
    <article
      className="
        rounded-2xl
        border
        border-neutral-800
        bg-neutral-900
        p-6
        transition-all
        duration-300
        hover:border-neutral-700
      "
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-neutral-600">
            {platform.category}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {platform.name}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1.5">
          <Icon className="h-4 w-4 text-neutral-300" />

          <span className="text-xs font-medium text-neutral-300">
            {platform.statusLabel || definition.label}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
        {platform.description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
        <span className="text-xs text-neutral-600">
          {platform.updatedAt
            ? `Updated ${platform.updatedAt}`
            : "Status monitored"}
        </span>

        <span className="text-xs text-neutral-700">
          {definition.description}
        </span>
      </div>
    </article>
  );
}