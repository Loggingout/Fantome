import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import StatusHero from "../components/company/status/StatusHero";
import StatusSummary from "../components/company/status/StatusSummary";
import StatusIncidentBanner from "../components/company/status/StatusIncidentBanner";
import StatusPlatformGrid from "../components/company/status/StatusPlatformGrid";
import StatusLastUpdated from "../components/company/status/StatusLastUpdated";

import type { PlatformStatusRecord } from "../../../types/status";
import { getPublicPlatformStatuses } from "../../../services/statusService";

export default function StatusPage() {
  const [platforms, setPlatforms] = useState<PlatformStatusRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getPublicPlatformStatuses()
      .then((records) => {
        if (isCurrent) {
          setPlatforms(records);
          setError(null);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError("Live status is temporarily unavailable.");
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const latestUpdatedAt = platforms
    .map((platform) => platform.updatedAt)
    .filter(
      (updatedAt): updatedAt is string =>
        Boolean(updatedAt) &&
        !Number.isNaN(Date.parse(updatedAt)),
    )
    .sort(
      (left, right) =>
        Date.parse(right) - Date.parse(left),
    )[0];

  const lastUpdated = latestUpdatedAt
    ? new Date(latestUpdatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : undefined;

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6 text-white sm:px-6 sm:py-10">
      <Helmet>
        <title>Status | Fantome Technologies</title>

        <meta
          name="description"
          content="View the current status, uptime history, and recent incidents across the Fantome Technologies ecosystem."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Status | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="View the current status, uptime history, and recent incidents across the Fantome Technologies ecosystem."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/status"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/new-logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Status | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="View the current status, uptime history, and recent incidents across the Fantome Technologies ecosystem."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/new-logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/status"
        />
      </Helmet>

      <div
        className="
          mx-auto
          max-w-6xl
          overflow-hidden
          rounded-[28px]
          border
          border-neutral-800
          bg-neutral-900
          shadow-[0_20px_70px_rgba(0,0,0,0.4)]
        "
      >
        <StatusHero />

        <main>
          <StatusSummary
            platforms={platforms}
            isLoading={isLoading}
          />

          {error && (
            <div className="mx-auto mt-6 max-w-5xl px-5 sm:px-8">
              <div
                role="alert"
                className="rounded-xl border border-amber-900/40 bg-amber-950/20 px-5 py-4"
              >
                <p className="text-sm text-amber-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          <StatusPlatformGrid platforms={platforms} />

          <StatusIncidentBanner platforms={platforms} />

          <div className="px-5 sm:px-8">
            <StatusLastUpdated
              lastUpdated={lastUpdated}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}