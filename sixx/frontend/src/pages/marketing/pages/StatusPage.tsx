import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

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
        if (isCurrent) setPlatforms(records);
      })
      .catch(() => {
        if (isCurrent) {
          setError("Live status is temporarily unavailable.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const latestUpdatedAt = platforms
    .map((platform) => platform.updatedAt)
    .filter((updatedAt): updatedAt is string => Boolean(updatedAt))
    .sort((left, right) => Date.parse(right) - Date.parse(left))[0];

  const lastUpdated = latestUpdatedAt
    ? new Date(latestUpdatedAt).toLocaleString()
    : undefined;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Status | Fantome Technologies</title>

        <meta
          name="description"
          content="View the current status of platforms and services within the Fantome Technologies ecosystem."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Status | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="View the current status of platforms and services within the Fantome Technologies ecosystem."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/status"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Status | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="View the current status of platforms and services within the Fantome Technologies ecosystem."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/status"
        />
      </Helmet>

      <Navbar />

      <main>
        <StatusHero />

        {error && (
          <div
            role="status"
            className="mx-auto max-w-6xl px-6 pt-6 text-sm text-amber-300"
          >
            {error}
          </div>
        )}

        <StatusSummary platforms={platforms} />

        <StatusIncidentBanner platforms={platforms} />

        <StatusPlatformGrid platforms={platforms} />

        <StatusLastUpdated lastUpdated={lastUpdated} isLoading={isLoading} />
      </main>

      <Footer />
    </div>
  );
}