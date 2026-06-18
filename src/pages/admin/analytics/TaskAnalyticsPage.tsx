import { useEffect, useState } from "react";
import api from "../../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../../components/layout/PageContainer";

interface AnalyticsData {
  labels: string[];
  data: number[];
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

export default function TaskAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard/analytics"),
      api.get("/admin/dashboard/stats"),
    ])
      .then(([aRes, sRes]) => {
        setAnalytics(aRes.data);
        setStats(sRes.data.stats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const trend = analytics
    ? analytics.change >= 0
      ? { label: `+${analytics.change}%`, up: true }
      : { label: `${analytics.change}%`, up: false }
    : null;

  return (
    <PageContainer>
      <SectionHeader title="Task Performance Analytics" />

      {loading ? (
        <div className="py-16 text-center text-neutral-500 text-sm">
          Loading…
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <DashCard className="p-5">
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
                  {trend.up ? "▲" : "▼"} {trend.label} vs last month
                </span>
              )}
            </DashCard>

            <DashCard className="p-5">
              <span className="text-neutral-500 text-xs uppercase tracking-widest">
                Pending Tasks
              </span>
              <span className="text-amber-400 text-3xl font-bold leading-none mt-1">
                {stats?.pendingTasks ?? 0}
              </span>
              <span className="text-neutral-600 text-xs mt-auto">
                awaiting action
              </span>
            </DashCard>

            <DashCard className="p-5">
              <span className="text-neutral-500 text-xs uppercase tracking-widest">
                Completed Tasks
              </span>
              <span className="text-emerald-400 text-3xl font-bold leading-none mt-1">
                {stats?.completedTasks ?? 0}
              </span>
              <span className="text-neutral-600 text-xs mt-auto">
                all time
              </span>
            </DashCard>

            <DashCard className="p-5">
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

          {/* Monthly breakdown table */}
          <DashCard className="p-6">
            <h3 className="text-white text-sm font-semibold mb-4">
              Monthly Task Completion — Last 6 Months
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="pb-3 pr-8 text-neutral-500 font-medium">Month</th>
                    <th className="pb-3 pr-8 text-neutral-500 font-medium">
                      Completion Rate
                    </th>
                    <th className="pb-3 text-neutral-500 font-medium">
                      Progress Bar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {analytics?.labels.map((label, i) => {
                    const val = analytics.data[i] ?? 0;
                    const isLatest = i === analytics.labels.length - 1;
                    return (
                      <tr key={label} className="hover:bg-neutral-800/20 transition-colors">
                        <td className="py-3 pr-8">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{label}</span>
                            {isLatest && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-400">
                                current
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-8">
                          <span
                            className={`font-semibold ${
                              val >= 75
                                ? "text-emerald-400"
                                : val >= 50
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}
                          >
                            {val}%
                          </span>
                        </td>
                        <td className="py-3 w-full min-w-[160px]">
                          <div className="w-full bg-neutral-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                val >= 75
                                  ? "bg-emerald-500"
                                  : val >= 50
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${val}%` }}
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
              Completion rate = completed tasks ÷ total tasks created that month.
              Months with no tasks show the nearest available value.
            </p>
          </DashCard>
        </div>
      )}
    </PageContainer>
  );
}
