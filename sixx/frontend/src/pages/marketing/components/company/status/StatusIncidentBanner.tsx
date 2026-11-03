import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";

import type {
  PlatformIncident,
  PlatformStatusRecord,
} from "../../../../../types/status";

interface StatusIncidentBannerProps {
  platforms: PlatformStatusRecord[];
}

const incidentStyles = {
  investigating: "bg-red-500/10 text-red-400",
  identified: "bg-amber-500/10 text-amber-400",
  monitoring: "bg-blue-500/10 text-blue-400",
  resolved: "bg-emerald-500/10 text-emerald-400",
};

const incidentLabels = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
};

function formatIncidentDate(date?: string) {
  if (!date) {
    return "Date unavailable";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function StatusIncidentBanner({
  platforms,
}: StatusIncidentBannerProps) {
  const incidentMap = new Map<
    string,
    PlatformIncident
  >();

  platforms.forEach((platform) => {
    (platform.incidents ?? []).forEach((incident) => {
      const existing = incidentMap.get(incident.id);

      if (existing) {
        incidentMap.set(incident.id, {
          ...existing,
          affectedPlatforms: Array.from(
            new Set([
              ...(existing.affectedPlatforms ?? []),
              platform.name,
            ]),
          ),
        });
      } else {
        incidentMap.set(incident.id, {
          ...incident,
          affectedPlatforms:
            incident.affectedPlatforms?.length
              ? incident.affectedPlatforms
              : [platform.name],
        });
      }
    });
  });

  const incidents = Array.from(incidentMap.values()).sort(
    (a, b) => {
      const left = Date.parse(a.startedAt);
      const right = Date.parse(b.startedAt);

      if (Number.isNaN(left) || Number.isNaN(right)) {
        return 0;
      }

      return right - left;
    },
  );

  return (
    <section
      id="recent-incidents"
      className="mx-auto max-w-5xl scroll-mt-8 px-5 pb-14 sm:px-8"
    >
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Recent Incidents
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Updates about disruptions and maintenance across the ecosystem.
          </p>
        </div>

        <Link
          to="/status/history"
          className="shrink-0 text-xs font-medium text-neutral-300 hover:text-white"
        >
          View incident history
        </Link>
      </div>

      {incidents.length === 0 ? (
        <div className="flex min-h-[110px] items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />

            <p className="text-sm text-neutral-400">
              No incidents reported.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <article
              key={incident.id}
              className="
                rounded-2xl
                border
                border-neutral-800
                bg-neutral-900
                p-6
              "
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {incident.title}
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500">
                      {incident.affectedPlatforms?.join(", ") ||
                        "Ecosystem"}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                    incidentStyles[incident.status]
                  }`}
                >
                  {incidentLabels[incident.status]}
                </span>
              </div>

              {incident.message && (
                <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                  {incident.message}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5" />
                  Started {formatIncidentDate(incident.startedAt)}
                </span>

                {incident.resolvedAt && (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Resolved {formatIncidentDate(incident.resolvedAt)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}