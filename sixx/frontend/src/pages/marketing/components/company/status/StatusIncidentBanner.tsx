import { AlertTriangle, CheckCircle2 } from "lucide-react";

import type { PlatformStatusRecord } from "../../../data/status.data";

interface StatusIncidentBannerProps {
  platforms: PlatformStatusRecord[];
}

export default function StatusIncidentBanner({
  platforms,
}: StatusIncidentBannerProps) {
  const affectedPlatforms = platforms.filter(
    (platform) =>
      platform.status === "outage" ||
      platform.status === "degraded" ||
      platform.status === "maintenance",
  );

  if (affectedPlatforms.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800">
            <CheckCircle2 className="h-4 w-4 text-neutral-300" />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              No active service issues detected
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Current platform status is being monitored.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800">
            <AlertTriangle className="h-4 w-4 text-neutral-300" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-white">
              Attention required
            </p>

            <p className="mt-1 text-xs leading-relaxed text-neutral-500">
              {affectedPlatforms.length} platform
              {affectedPlatforms.length === 1 ? "" : "s"} currently require
              attention.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {affectedPlatforms.map((platform) => (
                <span
                  key={platform.id}
                  className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs text-neutral-400"
                >
                  {platform.name}: {platform.statusLabel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}