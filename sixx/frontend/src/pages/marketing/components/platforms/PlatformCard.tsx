
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Platform } from "../../data/platforms.data";

interface PlatformCardProps {
  platform: Platform;
  index: number;
}

export default function PlatformCard({
  platform,
  index,
}: PlatformCardProps) {
  const Icon = platform.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-xl"
    >
      <div className="flex min-h-[360px] flex-col p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <Icon size={24} />
          </div>

          <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500">
            {platform.status}
          </span>
        </div>

        <div className="mt-10">
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            {platform.category}
          </p>

          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {platform.name}
          </h3>

          <p className="mt-4 max-w-xl leading-7 text-neutral-600">
            {platform.description}
          </p>
        </div>

        <div className="mt-auto pt-8">
          <a
            href={platform.url}
            target={platform.external ? "_blank" : undefined}
            rel={platform.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 transition-colors hover:text-neutral-500"
          >
            Visit Platform
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

