import { useEffect, useState } from "react";
import { Activity, Clock, ExternalLink, MousePointerClick, Users } from "lucide-react";

import PageContainer, { DashCard, SectionHeader, StatCard } from "../../../components/layout/PageContainer";
import { getWebsiteAnalyticsSummary, type WebsiteAnalyticsSummary } from "../../../services/websiteAnalyticsService";

function formatSeconds(seconds: number) {
  if (seconds <= 0) return "0s";
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${remaining}s`;
}

export default function WebsiteAnalyticsPage() {
  const [summary, setSummary] = useState<WebsiteAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    getWebsiteAnalyticsSummary()
      .then((data) => {
        if (isCurrent) setSummary(data);
      })
      .catch((loadError) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load website analytics.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const maxVisits = Math.max(...(summary?.daily ?? []).map((day) => day.visits), 1);

  return (
    <PageContainer>
      <SectionHeader title="Website Analytics" />
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">{error}</p>}
      {isLoading ? (
        <p role="status" className="text-sm text-neutral-400">Loading website analytics...</p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Visits" value={String(summary?.totals.visits ?? 0)} sub="Last 30 days" trend={{ value: "live", up: true }} />
            <StatCard label="Unique visitors" value={String(summary?.totals.uniqueVisitors ?? 0)} sub="Anonymous sessions" trend={{ value: "live", up: true }} />
            <StatCard label="Avg. time on page" value={formatSeconds(summary?.totals.averageVisitSeconds ?? 0)} sub="Public pages only" trend={{ value: "live", up: true }} />
            <StatCard label="Platform clicks" value={String(summary?.totals.linkClicks ?? 0)} sub="Outbound links" trend={{ value: "live", up: true }} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <DashCard className="gap-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500">Daily visits</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Traffic over the last 30 days</h3>
              </div>
              {(summary?.daily.length ?? 0) === 0 ? (
                <p className="text-sm text-neutral-500">No public website traffic has been recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {summary?.daily.map((day) => (
                    <div key={day.date} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3 text-sm">
                      <span className="text-neutral-500">{new Date(`${day.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
                        <div className="h-full rounded-full bg-red-600" style={{ width: `${Math.max(4, (day.visits / maxVisits) * 100)}%` }} />
                      </div>
                      <span className="text-right text-neutral-300">{day.visits}</span>
                    </div>
                  ))}
                </div>
              )}
            </DashCard>

            <DashCard className="gap-4">
              <div className="flex items-center gap-3">
                <MousePointerClick className="h-5 w-5 text-neutral-400" />
                <h3 className="text-lg font-semibold text-white">Platform Link Clicks</h3>
              </div>
              {(summary?.platformClicks.length ?? 0) === 0 ? (
                <p className="text-sm text-neutral-500">No platform clicks recorded.</p>
              ) : (
                <div className="space-y-3">
                  {summary?.platformClicks.map((row) => (
                    <div key={row.platformId} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-white">{row.platformId}</p>
                        <span className="text-sm text-neutral-300">{row.clicks} clicks</span>
                      </div>
                      <a href={row.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white">
                        {row.url} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </DashCard>
          </div>

          <DashCard className="gap-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-neutral-400" />
              <h3 className="text-lg font-semibold text-white">Top Public Pages</h3>
            </div>
            {(summary?.topPages.length ?? 0) === 0 ? (
              <p className="text-sm text-neutral-500">No page visits recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[42rem] text-left text-sm">
                  <thead className="border-b border-neutral-800 text-xs uppercase tracking-widest text-neutral-500">
                    <tr><th className="py-3 pr-4">Page</th><th className="py-3 pr-4">Visits</th><th className="py-3 pr-4">Unique</th><th className="py-3">Avg. time</th></tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {summary?.topPages.map((page) => (
                      <tr key={page.page}>
                        <td className="py-3 pr-4 text-white">{page.page}</td>
                        <td className="py-3 pr-4 text-neutral-300">{page.visits}</td>
                        <td className="py-3 pr-4 text-neutral-400">{page.uniqueVisitors}</td>
                        <td className="py-3 text-neutral-400">{formatSeconds(page.averageVisitSeconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashCard>
        </div>
      )}
    </PageContainer>
  );
}
