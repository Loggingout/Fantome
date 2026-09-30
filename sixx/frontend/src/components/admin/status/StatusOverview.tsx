import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Wrench,
  XCircle,
} from "lucide-react";

import type {
  PlatformStatusRecord,
  StatusCounts,
} from "../../../types/status";

interface StatusOverviewProps {
  platforms: PlatformStatusRecord[];
}

function getStatusCounts(
  platforms: PlatformStatusRecord[],
): StatusCounts {
  return {
    total: platforms.length,
    operational: platforms.filter(
      (platform) => platform.status === "operational",
    ).length,
    degraded: platforms.filter(
      (platform) => platform.status === "degraded",
    ).length,
    maintenance: platforms.filter(
      (platform) => platform.status === "maintenance",
    ).length,
    outage: platforms.filter(
      (platform) => platform.status === "outage",
    ).length,
    unknown: platforms.filter(
      (platform) => platform.status === "unknown",
    ).length,
  };
}

const statItems = [
  {
    key: "total",
    label: "Total Platforms",
    icon: Activity,
  },
  {
    key: "operational",
    label: "Operational",
    icon: CheckCircle2,
  },
  {
    key: "degraded",
    label: "Degraded",
    icon: AlertTriangle,
  },
  {
    key: "maintenance",
    label: "Maintenance",
    icon: Wrench,
  },
  {
    key: "outage",
    label: "Outages",
    icon: XCircle,
  },
  {
    key: "unknown",
    label: "Unknown",
    icon: CircleDashed,
  },
] as const;

export default function StatusOverview({
  platforms,
}: StatusOverviewProps) {
  const counts = getStatusCounts(platforms);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {statItems.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="
            rounded-2xl
            border
            border-neutral-800
            bg-neutral-900
            p-5
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500">
                {label}
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                {counts[key]}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800">
              <Icon className="h-4 w-4 text-neutral-300" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}