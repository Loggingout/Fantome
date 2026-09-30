import { motion } from "framer-motion";
import { Activity } from "lucide-react";

import type {
  PlatformStatusRecord,
  PlatformStatus,
} from "../../../data/status.data";
import {
  statusDefinitions,
  statusPageContent,
} from "../../../data/status.data";

interface StatusSummaryProps {
  platforms: PlatformStatusRecord[];
}

const statusOrder: PlatformStatus[] = [
  "outage",
  "degraded",
  "maintenance",
  "unknown",
  "operational",
];

function getOverallStatus(
  platforms: PlatformStatusRecord[],
): PlatformStatus {
  if (platforms.length === 0) {
    return "unknown";
  }

  for (const status of statusOrder) {
    if (platforms.some((platform) => platform.status === status)) {
      return status;
    }
  }

  return "unknown";
}

export default function StatusSummary({
  platforms,
}: StatusSummaryProps) {
  const { summary } = statusPageContent;
  const overallStatus = getOverallStatus(platforms);
  const definition = statusDefinitions[overallStatus];
  const Icon = definition.icon;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        className="
          rounded-3xl
          border
          border-neutral-800
          bg-neutral-900
          p-8
          sm:p-10
        "
        initial={{ opacity: 0, y: 28 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.42, 0, 0.58, 1],
          },
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs tracking-widest uppercase text-neutral-500">
              {summary.eyebrow}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
              {summary.title}
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
              {summary.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900">
              <Icon className="h-5 w-5 text-neutral-300" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-600">
                Ecosystem
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {definition.label}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs text-neutral-600">
          <Activity className="h-3.5 w-3.5" />
          {platforms.length} platform
          {platforms.length === 1 ? "" : "s"} monitored
        </div>
      </motion.div>
    </section>
  );
}