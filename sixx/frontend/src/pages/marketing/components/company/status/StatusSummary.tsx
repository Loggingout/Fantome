import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Wrench,
  XCircle,
  CircleDashed,
  Code2,
} from "lucide-react";

import type { PlatformStatusRecord } from "../../../../../types/status";

interface StatusSummaryProps {
  platforms: PlatformStatusRecord[];
  isLoading?: boolean;
}

const statusPresentation = {
  operational: {
    label: "All Systems Operational",
    guideLabel: "Operational",
    description: "Available and performing as expected.",
    icon: CheckCircle2,
    color: "text-emerald-500",
    background: "bg-emerald-500/10",
  },
  degraded: {
    label: "Performance Issues Detected",
    guideLabel: "Degraded Performance",
    description: "Available, but some features may be slower or impaired.",
    icon: AlertTriangle,
    color: "text-orange-400",
    background: "bg-orange-500/10",
  },
  maintenance: {
    label: "Scheduled Maintenance",
    guideLabel: "Scheduled Maintenance",
    description: "Temporarily limited or unavailable during planned work.",
    icon: Wrench,
    color: "text-blue-500",
    background: "bg-blue-500/10",
  },
  outage: {
    label: "Service Disruption Detected",
    guideLabel: "Service Outage",
    description: "Unavailable or experiencing a major service interruption.",
    icon: XCircle,
    color: "text-red-500",
    background: "bg-red-500/10",
  },
  unknown: {
    label: "Status Currently Unavailable",
    guideLabel: "Unknown",
    description: "Current platform health has not yet been confirmed.",
    icon: CircleDashed,
    color: "text-white",
    background: "bg-white/10",
  },
  being_developed: {
    label: "Platforms In Development",
    guideLabel: "Being Developed",
    description: "Not yet launched; actively being built and prepared.",
    icon: Code2,
    color: "text-violet-400",
    background: "bg-violet-500/10",
  },
};

function getOverallStatus(
  platforms: PlatformStatusRecord[],
): keyof typeof statusPresentation {
  if (platforms.length === 0) {
    return "unknown";
  }

  const priority: Array<keyof typeof statusPresentation> = [
    "outage",
    "degraded",
    "maintenance",
    "unknown",
    "being_developed",
    "operational",
  ];

  return (
    priority.find((status) =>
      platforms.some((platform) => platform.status === status),
    ) ?? "unknown"
  );
}

export default function StatusSummary({
  platforms,
  isLoading = false,
}: StatusSummaryProps) {
  const overallStatus = getOverallStatus(platforms);
  const presentation = statusPresentation[overallStatus];
  const Icon = presentation.icon;

  const label = isLoading
    ? "Checking Ecosystem Status..."
    : presentation.label;

  return (
    <section className="mx-auto mt-6 w-full max-w-5xl px-3 sm:mt-8 sm:px-8">
      <motion.div
        className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15 }}
      >
        <div className="flex flex-col gap-4 border-b border-neutral-800 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isLoading ? "bg-neutral-800" : presentation.background
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isLoading ? "text-neutral-500" : presentation.color
                }`}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">
                Overall Status
              </p>
              <h2
                className="mt-1 wrap-break-word text-base font-semibold text-white sm:text-lg"
                aria-live="polite"
              >
                {label}
              </h2>
            </div>
          </div>

          <div className="flex items-baseline gap-2 sm:justify-end">
            <span className="text-2xl font-semibold tabular-nums text-white">
              {isLoading ? "—" : platforms.length}
            </span>
            <span className="text-xs text-neutral-400">
              monitored platform{platforms.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-white">Status Guide</h3>
            <p className="mt-1 text-xs text-neutral-500">
              What each platform status means
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(statusPresentation).map(
              ([key, item], index) => {
                const StatusIcon = item.icon;

                return (
                  <div
                    key={key}
                    className={`flex min-w-0 items-start gap-3 border-neutral-800 py-3 sm:px-3 ${
                      index > 0 ? "border-t sm:border-t-0" : ""
                    } ${index >= 2 ? "sm:border-t" : ""}`}
                  >
                    <StatusIcon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${item.color}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-medium ${item.color}`}>
                        {item.guideLabel}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}