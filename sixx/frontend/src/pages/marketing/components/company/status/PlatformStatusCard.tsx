
import {
  CheckCircle2,
  AlertTriangle,
  Wrench,
  XCircle,
  CircleDashed,
  Code2,
} from "lucide-react";

import type {
  PlatformStatus,
  PlatformStatusRecord,
} from "../../../../../types/status";

import UptimeHistoryBar from "./UptimeHistoryBar";

interface PlatformStatusCardProps {
  platform: PlatformStatusRecord;
}

const statusPresentation: Record<
  PlatformStatus,
  {
    icon: typeof CheckCircle2;
    label: string;
    color: string;
  }
> = {
  operational: {
    icon: CheckCircle2,
    label: "Operational",
    color: "text-emerald-500",
  },
  degraded: {
    icon: AlertTriangle,
    label: "Degraded Performance",
    color: "text-amber-500",
  },
  being_developed: {
    icon: Code2,
    label: "Being Developed",
    color: "text-violet-400",
  },
  maintenance: {
    icon: Wrench,
    label: "Maintenance",
    color: "text-blue-500",
  },
  outage: {
    icon: XCircle,
    label: "Service Outage",
    color: "text-red-500",
  },
  unknown: {
    icon: CircleDashed,
    label: "Status Unknown",
    color: "text-neutral-500",
  },
};

function normalizeStatus(value: unknown): PlatformStatus {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  const validStatuses: PlatformStatus[] = [
    "operational",
    "degraded",
    "maintenance",
    "outage",
    "being_developed",
    "unknown",
  ];

  return validStatuses.includes(normalized as PlatformStatus)
    ? (normalized as PlatformStatus)
    : "unknown";
}

export default function PlatformStatusCard({
  platform,
}: PlatformStatusCardProps) {
  const status = normalizeStatus(platform.status);
  const presentation = statusPresentation[status];
  const Icon = presentation.icon;
  const activeIncident = platform.incidents?.find(
    (incident) => incident.status !== "resolved",
  );

  const uptime =
    typeof platform.uptimePercentage === "number" &&
    Number.isFinite(platform.uptimePercentage) &&
    platform.uptimePercentage >= 0 &&
    platform.uptimePercentage <= 100
      ? `${platform.uptimePercentage.toFixed(2)}%`
      : "—";

  return (
    <article className="px-6 py-7 sm:px-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Icon className={`h-4 w-4 shrink-0 ${presentation.color}`} />

          <div className="min-w-0">
            <h3 className="text-sm font-medium text-white sm:text-base">
              {platform.name || "Unnamed Platform"}
            </h3>

            <p className="mt-0.5 text-xs text-neutral-500">
              {platform.category || "Platform"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 sm:justify-end">
          <span className={`text-xs ${presentation.color}`}>
            {platform.statusLabel?.trim() || presentation.label}
          </span>

          <div className="text-right">
            <p className="text-sm font-semibold text-neutral-200">
              {uptime}
            </p>

            <p className="text-[10px] text-neutral-500">
              Last 90 days
            </p>
          </div>
        </div>
      </div>

      <UptimeHistoryBar
        history={platform.uptimeHistory}
        days={90}
      />

      {platform.message && (
        <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3">
          <p className="text-xs leading-relaxed text-neutral-400">
            {platform.message}
          </p>
        </div>
      )}

      {activeIncident && (
        <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium text-white">
              {activeIncident.title}
            </p>

            <span className={`text-[10px] uppercase tracking-wide ${presentation.color}`}>
              {activeIncident.status}
            </span>
          </div>

          {activeIncident.message && (
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
              {activeIncident.message}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
