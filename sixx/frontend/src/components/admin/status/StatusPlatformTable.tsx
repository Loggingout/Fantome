import { Pencil, RefreshCw } from "lucide-react";

import type { PlatformStatusRecord } from "../../../types/status";

interface StatusPlatformTableProps {
  platforms: PlatformStatusRecord[];
  onEdit: (platform: PlatformStatusRecord) => void;
  onRefresh?: () => void;
}

const statusStyles = {
  operational: "border-neutral-700 bg-neutral-800 text-neutral-200",
  degraded: "border-amber-900/50 bg-amber-950/30 text-amber-300",
  maintenance: "border-blue-900/50 bg-blue-950/30 text-blue-300",
  outage: "border-red-900/50 bg-red-950/30 text-red-300",
  unknown: "border-neutral-800 bg-neutral-950 text-neutral-500",
};

export default function StatusPlatformTable({
  platforms,
  onEdit,
  onRefresh,
}: StatusPlatformTableProps) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-neutral-800
        bg-neutral-900
      "
    >
      <div className="flex flex-col gap-4 border-b border-neutral-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Ecosystem Monitoring
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Platform Status
          </h2>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-neutral-700
              bg-neutral-800
              px-4
              py-2.5
              text-sm
              font-medium
              text-neutral-200
              transition
              hover:bg-neutral-700
            "
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        )}
      </div>

      {platforms.length === 0 ? (
        <div className="px-6 py-10">
          <p className="text-sm text-neutral-500">
            No platform status records are currently available.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:grid md:grid-cols-[1.3fr_1fr_1fr_auto] gap-4 border-b border-neutral-800 px-6 py-3 text-xs uppercase tracking-widest text-neutral-600">
            <span>Platform</span>
            <span>Category</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-neutral-800">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="
                  grid
                  grid-cols-1
                  gap-4
                  px-6
                  py-5
                  md:grid-cols-[1.3fr_1fr_1fr_auto]
                  md:items-center
                "
              >
                <div>
                  <p className="font-medium text-white">
                    {platform.name}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {platform.description}
                  </p>
                </div>

                <div className="text-sm text-neutral-400">
                  {platform.category}
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${
                      statusStyles[platform.status]
                    }`}
                  >
                    {platform.statusLabel}
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => onEdit(platform)}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-neutral-800
                      bg-neutral-950
                      px-3
                      py-2
                      text-sm
                      text-neutral-300
                      transition
                      hover:border-neutral-700
                      hover:text-white
                    "
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}