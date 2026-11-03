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
    icon: CheckCircle2,
    color: "text-emerald-500",
    background: "bg-emerald-500/10",
  },
  degraded: {
    label: "Performance Issues Detected",
    icon: AlertTriangle,
    color: "text-amber-500",
    background: "bg-amber-500/10",
  },
  maintenance: {
    label: "Scheduled Maintenance",
    icon: Wrench,
    color: "text-blue-500",
    background: "bg-blue-500/10",
  },
  outage: {
    label: "Service Disruption Detected",
    icon: XCircle,
    color: "text-red-500",
    background: "bg-red-500/10",
  },
  unknown: {
    label: "Status Currently Unavailable",
    icon: CircleDashed,
    color: "text-neutral-500",
    background: "bg-neutral-800",
  },
  being_developed: {
    label: "Platforms In Development",
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

  const description = isLoading
    ? "Retrieving live platform information"
    : `${platforms.length} monitored platform${platforms.length === 1 ? "" : "s"}`;

  return (
    <section className="mx-auto mt-8 w-full max-w-[850px] px-5 sm:px-8">
      <motion.div
        className="
          flex
          min-h-[92px]
          items-center
          gap-4
          rounded-xl
          border
          border-neutral-700
          bg-neutral-900
          px-6
          py-6
          shadow-[0_12px_35px_rgba(0,0,0,0.35)]
          sm:px-9
        "
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15 }}
        aria-live="polite"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isLoading ? "bg-neutral-800" : presentation.background
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              isLoading ? "text-neutral-500" : presentation.color
            }`}
          />
        </span>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            {label}
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            {description}
          </p>
        </div>
      </motion.div>
    </section>
  );
}