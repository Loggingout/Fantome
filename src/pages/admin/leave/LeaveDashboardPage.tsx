import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CheckCircle2, XCircle, Clock, Users } from "lucide-react";
import api from "../../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

interface LeaveRequest {
  _id: string;
  employee: { _id: string; name: string; email: string };
  type: "sick" | "time-off";
  startDate: string;
  endDate: string;
  reason?: string;
  status: "pending" | "approved" | "denied";
  adminNote?: string;
  createdAt: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function workDays(start: string, end: string) {
  let days = 0;
  const d = new Date(start);
  const e = new Date(end);
  d.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);
  while (d <= e) {
    if (d.getDay() !== 0 && d.getDay() !== 6) days++;
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  denied: "bg-red-500/15 text-red-400 border border-red-500/30",
};

export default function LeaveDashboardPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(() => {
    api.get("/leave/all")
      .then((res) => setRequests(res.data.requests))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const decide = async (id: string, status: "approved" | "denied") => {
    setActing(id);
    try {
      await api.patch(`/leave/${id}/status`, { status });
      setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
    } catch (err) {
      console.error(err);
    } finally {
      setActing(null);
    }
  };

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const pending = requests.filter((r) => r.status === "pending");
  const approvedThisMonth = requests.filter(
    (r) => r.status === "approved" && new Date(r.createdAt) >= thisMonthStart
  );
  const deniedThisMonth = requests.filter(
    (r) => r.status === "denied" && new Date(r.createdAt) >= thisMonthStart
  );

  // Currently on leave: approved requests where today falls within the range
  const today = now.toISOString().split("T")[0];
  const onLeave = requests.filter(
    (r) =>
      r.status === "approved" &&
      r.startDate <= today &&
      r.endDate >= today
  );

  const stats = [
    { label: "Pending Requests", value: pending.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Approved This Month", value: approvedThisMonth.length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Denied This Month", value: deniedThisMonth.length, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "On Leave Today", value: onLeave.length, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Leave Dashboard" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <DashCard key={s.label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-neutral-500 text-xs">{s.label}</p>
              </div>
            </div>
          </DashCard>
        ))}
      </div>

      {/* Pending requests quick-action */}
      <DashCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-neutral-500" />
            <h3 className="text-white font-semibold">Pending Requests</h3>
            {pending.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {pending.length}
              </span>
            )}
          </div>
          <Link
            to="/admin/leave/requests"
            className="text-xs text-neutral-500 hover:text-white transition"
          >
            View all requests →
          </Link>
        </div>

        {loading ? (
          <p className="text-neutral-400 text-sm">Loading…</p>
        ) : pending.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
            <p className="text-neutral-500 text-sm">No pending requests — all caught up!</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-800/60">
            {pending.slice(0, 8).map((r) => (
              <div key={r._id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{r.employee.name}</p>
                  <p className="text-neutral-500 text-xs">{r.employee.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      r.type === "sick"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {r.type === "sick" ? "Sick Leave" : "PTO"}
                  </span>
                  <span className="text-neutral-400 text-xs">
                    {fmtDate(r.startDate)} – {fmtDate(r.endDate)}
                  </span>
                  <span className="text-neutral-600 text-xs">
                    {workDays(r.startDate, r.endDate)} working day{workDays(r.startDate, r.endDate) !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => decide(r._id, "approved")}
                    disabled={acting === r._id}
                    className="px-3 py-1.5 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => decide(r._id, "denied")}
                    disabled={acting === r._id}
                    className="px-3 py-1.5 text-xs bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/25 transition disabled:opacity-50"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
            {pending.length > 8 && (
              <div className="pt-4 text-center">
                <Link to="/admin/leave/requests" className="text-xs text-neutral-500 hover:text-white transition">
                  + {pending.length - 8} more — view all
                </Link>
              </div>
            )}
          </div>
        )}
      </DashCard>

      {/* On Leave Today */}
      {onLeave.length > 0 && (
        <DashCard className="p-6 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-neutral-500" />
            <h3 className="text-white font-semibold">On Leave Today</h3>
          </div>
          <div className="flex flex-col gap-3">
            {onLeave.map((r) => (
              <div key={r._id} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{r.employee.name}</p>
                  <p className="text-neutral-500 text-xs">{r.employee.email}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    r.type === "sick"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {r.type === "sick" ? "Sick Leave" : "PTO"} · until {fmtDate(r.endDate)}
                </span>
              </div>
            ))}
          </div>
        </DashCard>
      )}
    </PageContainer>
  );
}
