import { useEffect, useRef, useState, useCallback } from "react";
import api from "../../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../../components/layout/PageContainer";

type Period = "daily" | "weekly" | "monthly" | "yearly";

interface Row {
  label: string;
  rate: number;
  total: number;
  completed: number;
}

interface AnalyticsData {
  period: Period;
  rows: Row[];
  current: number;
  previous: number;
  change: number;
}

interface StatsData {
  totalEmployees: number;
  newHires: number;
  pendingTasks: number;
  completedTasks: number;
}

const PERIODS: { key: Period; label: string }[] = [
  { key: "daily",   label: "Daily" },
  { key: "weekly",  label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly",  label: "Yearly" },
];

const POLL_MS = 15_000;

export default function TaskAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      try {
        const [aRes, sRes] = await Promise.all([
          api.get(`/admin/dashboard/task-analytics?period=${period}`),
          api.get("/admin/dashboard/stats"),
        ]);
        setAnalytics(aRes.data);
        setStats(sRes.data.stats);
        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [period]
  );

  // Fetch on period change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Poll every 15 s, only while tab is visible
  useEffect(() => {
    const start = () => {
      intervalRef.current = setInterval(() => {
        if (document.visibilityState === "visible") fetchData(true);
      }, POLL_MS);
    };
    const stop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    start();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") fetchData(true);
    });
    return () => {
      stop();
      document.removeEventListener("visibilitychange", () => {});
    };
  }, [fetchData]);

  const trend = analytics
    ? analytics.change >= 0
      ? { label: `+${analytics.change}%`, up: true }
      : { label: `${analytics.change}%`, up: false }
    : null;

  const periodLabel = PERIODS.find((p) => p.key === period)?.label ?? "";
  const prevLabel =
    period === "daily" ? "yesterday"
    : period === "weekly" ? "last week"
    : period === "monthly" ? "last month"
    : "last year";

  return (
    <PageContainer>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <SectionHeader title="Task Performance Analytics" />
        {lastUpdated && (
          <span className="text-neutral-600 text-xs mt-1">
            Live · updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Period tabs */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              period === key
                ? "bg-white text-black"
                : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-neutral-500 text-sm">Loading…</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <DashCard className="p-5 flex flex-col gap-1">
              <span className="text-neutral-500 text-xs uppercase tracking-widest">
                Completion Rate
              </span>
              <span className="text-white text-3xl font-bold leading-none mt-1">
                {analytics?.current ?? 0}%
              </span>
              {trend && (
                <span
                  className={`mt-auto text-xs font-medium px-2 py-0.5 rounded-full w-fit ${
                    trend.up
                      ? "bg-emerald-900/40 text-emerald-400"
                      : "bg-red-900/40 text-red-400"
                  }`}
                >
                  {trend.up ? "▲" : "▼"} {trend.label} vs {prevLabel}
                </span>
              )}
            </DashCard>

            <DashCard className="p-5 flex flex-col gap-1">
              <span className="text-neutral-500 text-xs uppercase tracking-widest">
                Pending Tasks
              </span>
              <span className="text-amber-400 text-3xl font-bold leading-none mt-1">
                {stats?.pendingTasks ?? 0}
              </span>
              <span className="text-neutral-600 text-xs mt-auto">awaiting action</span>
            </DashCard>

            <DashCard className="p-5 flex flex-col gap-1">
              <span className="text-neutral-500 text-xs uppercase tracking-widest">
                Completed Tasks
              </span>
              <span className="text-emerald-400 text-3xl font-bold leading-none mt-1">
                {stats?.completedTasks ?? 0}
              </span>
              <span className="text-neutral-600 text-xs mt-auto">all time</span>
            </DashCard>

            <DashCard className="p-5 flex flex-col gap-1">
              <span className="text-neutral-500 text-xs uppercase tracking-widest">
                Active Employees
              </span>
              <span className="text-white text-3xl font-bold leading-none mt-1">
                {stats?.totalEmployees ?? 0}
              </span>
              <span className="text-neutral-600 text-xs mt-auto">
                {stats?.newHires ?? 0} new this month
              </span>
            </DashCard>
          </div>

          {/* Breakdown table */}
          <DashCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-sm font-semibold">
                {periodLabel} Task Completion —{" "}
                {period === "daily" ? "Last 14 Days"
                  : period === "weekly" ? "Last 8 Weeks"
                  : period === "monthly" ? "Last 12 Months"
                  : "Last 4 Years"}
              </h3>
              <span className="flex items-center gap-1.5 text-xs text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Live
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="pb-3 pr-6 text-neutral-500 font-medium">Period</th>
                    <th className="pb-3 pr-6 text-neutral-500 font-medium">Tasks</th>
                    <th className="pb-3 pr-6 text-neutral-500 font-medium">Completed</th>
                    <th className="pb-3 pr-6 text-neutral-500 font-medium">Rate</th>
                    <th className="pb-3 text-neutral-500 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {analytics?.rows.map((row, i) => {
                    const isLatest = i === (analytics.rows.length - 1);
                    const color =
                      row.rate >= 75 ? "bg-emerald-500"
                      : row.rate >= 50 ? "bg-amber-500"
                      : "bg-red-500";
                    const textColor =
                      row.rate >= 75 ? "text-emerald-400"
                      : row.rate >= 50 ? "text-amber-400"
                      : "text-red-400";
                    return (
                      <tr key={row.label} className="hover:bg-neutral-800/20 transition-colors">
                        <td className="py-3 pr-6">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{row.label}</span>
                            {isLatest && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-400">
                                current
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-6 text-neutral-400">{row.total}</td>
                        <td className="py-3 pr-6 text-neutral-300">{row.completed}</td>
                        <td className="py-3 pr-6">
                          <span className={`font-semibold ${textColor}`}>{row.rate}%</span>
                        </td>
                        <td className="py-3 w-full min-w-[160px]">
                          <div className="w-full bg-neutral-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${color}`}
                              style={{ width: `${row.rate}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-neutral-600 text-xs mt-4">
              Rate = completed ÷ total tasks created in that period. Updates every 15 seconds.
            </p>
          </DashCard>
        </div>
      )}
    </PageContainer>
  );
}

