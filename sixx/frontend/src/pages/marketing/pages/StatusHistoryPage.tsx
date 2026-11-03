import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3 } from "lucide-react";

import StatusHero from "../components/company/status/StatusHero";
import type { IncidentStatus, PlatformIncident } from "../../../types/status";
import { getIncidentHistory } from "../../../services/statusService";

const incidentStyles: Record<IncidentStatus, string> = {
  investigating: "bg-red-500/10 text-red-400",
  identified: "bg-amber-500/10 text-amber-400",
  monitoring: "bg-blue-500/10 text-blue-400",
  resolved: "bg-emerald-500/10 text-emerald-400",
};

const incidentLabels: Record<IncidentStatus, string> = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
};

const formatDate = (date?: string | null) =>
  date && !Number.isNaN(Date.parse(date))
    ? new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Date unavailable";

const monthKey = (date: string) =>
  new Date(date).toLocaleString("en-US", { month: "long", year: "numeric" });

export default function StatusHistoryPage() {
  const [incidents, setIncidents] = useState<PlatformIncident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getIncidentHistory()
      .then((records) => isCurrent && setIncidents(records))
      .catch(() => isCurrent && setError("Incident history is temporarily unavailable."))
      .finally(() => isCurrent && setIsLoading(false));

    return () => {
      isCurrent = false;
    };
  }, []);

  const groups = incidents.reduce<Record<string, PlatformIncident[]>>(
    (acc, incident) => {
      const key = Number.isNaN(Date.parse(incident.startedAt))
        ? "Unknown date"
        : monthKey(incident.startedAt);
      (acc[key] ??= []).push(incident);
      return acc;
    },
    {},
  );

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6 text-white sm:px-6 sm:py-10">
      <Helmet>
        <title>Incident History | Fantome Technologies</title>
        <meta
          name="description"
          content="Past incidents and maintenance across the Fantome Technologies ecosystem."
        />
        <link
          rel="canonical"
          href="https://fantometechnologies.com/status/history"
        />
      </Helmet>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-900 shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
        <StatusHero />

        <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
          <Link
            to="/status"
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to status
          </Link>

          <h1 className="mt-5 text-2xl font-semibold text-white">
            Incident History
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Past disruptions and maintenance across the ecosystem.
          </p>

          {error && (
            <p role="alert" className="mt-8 text-sm text-amber-300">
              {error}
            </p>
          )}

          {isLoading ? (
            <p className="mt-8 text-sm text-neutral-500">Loading incidents...</p>
          ) : (
            !error &&
            incidents.length === 0 && (
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 px-6 py-8">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <p className="text-sm text-neutral-400">No incidents reported.</p>
              </div>
            )
          )}

          {Object.entries(groups).map(([month, items]) => (
            <section key={month} className="mt-10">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-neutral-500">
                {month}
              </h2>

              <div className="space-y-4">
                {items.map((incident) => (
                  <article
                    key={incident.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {incident.title}
                        </h3>

                        <p className="mt-1 text-xs text-neutral-500">
                          {incident.affectedPlatforms?.join(", ") || "Ecosystem"}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${incidentStyles[incident.status]}`}
                      >
                        {incidentLabels[incident.status]}
                      </span>
                    </div>

                    {incident.message && (
                      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                        {incident.message}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-3.5 w-3.5" />
                        Started {formatDate(incident.startedAt)}
                      </span>

                      {incident.resolvedAt && (
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resolved {formatDate(incident.resolvedAt)}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
