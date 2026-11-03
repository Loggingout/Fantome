import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

interface StatusLastUpdatedProps {
  lastUpdated?: string;
  isLoading?: boolean;
}

export default function StatusLastUpdated({
  lastUpdated,
  isLoading = false,
}: StatusLastUpdatedProps) {
  return (
    <footer className="mx-auto max-w-5xl border-t border-neutral-800 px-5 py-7 sm:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 transition hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
            Visit Website
          </Link>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <p className="text-xs text-neutral-500">
            Powered by{" "}
            <span className="font-semibold text-neutral-300">
              Fantome Technologies
            </span>
          </p>

          <p className="inline-flex items-center gap-2 text-[11px] text-neutral-600">
            <Clock3 className="h-3 w-3" />

            {isLoading
              ? "Retrieving status..."
              : lastUpdated
                ? `Last updated ${lastUpdated}`
                : "Update time unavailable"}
          </p>
        </div>
      </div>
    </footer>
  );
}