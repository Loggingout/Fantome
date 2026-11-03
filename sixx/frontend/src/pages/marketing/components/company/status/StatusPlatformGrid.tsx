import { motion } from "framer-motion";

import type { PlatformStatusRecord } from "../../../../../types/status";

import PlatformStatusCard from "./PlatformStatusCard";

interface StatusPlatformGridProps {
  platforms: PlatformStatusRecord[];
}

export default function StatusPlatformGrid({
  platforms,
}: StatusPlatformGridProps) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <motion.div
        className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-xl font-semibold text-white">
            Uptime
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Last 90 Days
          </p>
        </div>

        <p className="text-xs text-neutral-600">
          {platforms.length} monitored service
          {platforms.length === 1 ? "" : "s"}
        </p>
      </motion.div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        {platforms.length > 0 ? (
          <div className="divide-y divide-neutral-800">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
              >
                <PlatformStatusCard platform={platform} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-400">
              No platform status records are currently available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}