import type { StatusHistoryPoint } from "../../../../../types/status";

interface UptimeHistoryBarProps {
  history?: StatusHistoryPoint[];
  days?: number;
}

const historyColors = {
  operational: "bg-emerald-500",
  degraded: "bg-orange-500",
  maintenance: "bg-blue-500",
  outage: "bg-red-500",
  being_developed: "bg-violet-500",
  unknown: "bg-white",
};

export default function UptimeHistoryBar({
  history = [],
  days = 90,
}: UptimeHistoryBarProps) {
  const visibleHistory = history.slice(-days);

  const bars =
    visibleHistory.length > 0
      ? visibleHistory
      : Array.from({ length: days }, (_, index) => ({
          date: `History unavailable ${index + 1}`,
          status: "unknown" as const,
        }));

  return (
    <div>
      <div
        className="flex h-6 items-center gap-[3px] overflow-hidden"
        role="img"
        aria-label={`${visibleHistory.length} historical status records available`}
      >
        {bars.map((point, index) => (
          <span
            key={`${point.date}-${index}`}
            title={
              visibleHistory.length > 0
                ? `${point.date}: ${point.status}`
                : "Historical data unavailable"
            }
            className={`
              h-5
              min-w-[3px]
              flex-1
              rounded-full
              ${historyColors[point.status]}
            `}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-neutral-500">
        <span>
          {visibleHistory.length > 0
            ? visibleHistory[0].date
            : "90 days ago"}
        </span>

        <span>
          {visibleHistory.length > 0
            ? visibleHistory[visibleHistory.length - 1].date
            : "Today"}
        </span>
      </div>

      {visibleHistory.length === 0 && (
        <p className="mt-2 text-[11px] text-neutral-600">
          Historical uptime data unavailable.
        </p>
      )}
    </div>
  );
}