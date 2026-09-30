import { RefreshCw } from "lucide-react";

interface StatusLastUpdatedProps {
  lastUpdated?: string;
  isLoading?: boolean;
}

export default function StatusLastUpdated({
  lastUpdated,
  isLoading = false,
}: StatusLastUpdatedProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-6 pb-16">
      <div className="flex flex-col gap-3 border-t border-neutral-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-600">
            Status Feed
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            {isLoading
              ? "Retrieving current ecosystem status..."
              : lastUpdated
                ? `Last updated ${lastUpdated}`
                : "Waiting for live status data."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <RefreshCw className="h-3.5 w-3.5" />
          Backend monitored
        </div>
      </div>
    </section>
  );
}