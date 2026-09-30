import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus2 } from "lucide-react";
import api from "../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../components/layout/PageContainer";

interface LeaveRequest {
  _id: string;
  type: "sick" | "time-off";
  startDate: string;
  endDate: string;
  reason?: string;
  status: "pending" | "approved" | "denied";
  adminNote?: string;
  createdAt: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

export default function MyLeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leave/mine")
      .then((res) => setRequests(res.data.requests))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;

  return (
    <PageContainer>
      <SectionHeader title="My Leave Requests" />

      {/* Summary pills */}
      {!loading && requests.length > 0 && (
        <div className="flex gap-3 mb-5 flex-wrap">
          <span className="px-3 py-1.5 text-xs rounded-xl bg-neutral-800 text-neutral-400 border border-neutral-700">
            {requests.length} total
          </span>
          {pending > 0 && (
            <span className="px-3 py-1.5 text-xs rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {pending} pending
            </span>
          )}
          {approved > 0 && (
            <span className="px-3 py-1.5 text-xs rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {approved} approved
            </span>
          )}
        </div>
      )}

      <DashCard className="p-6">
        {loading ? (
          <p className="text-neutral-400 text-sm">Loading…</p>
        ) : requests.length === 0 ? (
          <div className="py-10 text-center">
            <FilePlus2 className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm mb-4">You haven't submitted any leave requests yet.</p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/employee/time-off"
                className="px-4 py-2 text-sm bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition"
              >
                Request Time Off
              </Link>
              <Link
                to="/employee/sick-leave"
                className="px-4 py-2 text-sm bg-neutral-800 text-white rounded-xl font-medium hover:bg-neutral-700 border border-neutral-700 transition"
              >
                Sick Leave
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-800/60">
            {requests.map((r) => (
              <div key={r._id} className="py-4 flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Type badge */}
                <div className="shrink-0 pt-0.5">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      r.type === "sick"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {r.type === "sick" ? "Sick Leave" : "PTO"}
                  </span>
                </div>

                {/* Dates + reason */}
                <div className="flex-1 min-w-0">
                  <p className="text-neutral-200 text-sm font-medium">
                    {fmtDate(r.startDate)} – {fmtDate(r.endDate)}
                    <span className="ml-2 text-neutral-600 font-normal text-xs">
                      {workDays(r.startDate, r.endDate)} working day{workDays(r.startDate, r.endDate) !== 1 ? "s" : ""}
                    </span>
                  </p>
                  {r.reason && (
                    <p className="text-neutral-500 text-xs mt-0.5 truncate">{r.reason}</p>
                  )}
                  {r.adminNote && (
                    <p className="text-neutral-600 text-xs mt-1">
                      <span className="text-neutral-500">Admin note: </span>{r.adminNote}
                    </p>
                  )}
                  <p className="text-neutral-700 text-xs mt-1">
                    Submitted {fmtDate(r.createdAt)}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLE[r.status]}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashCard>

      {/* Quick actions */}
      {!loading && (
        <div className="flex gap-3 mt-4">
          <Link
            to="/employee/time-off"
            className="px-4 py-2 text-sm bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-xl hover:bg-neutral-700 hover:text-white transition"
          >
            + New Time Off Request
          </Link>
          <Link
            to="/employee/sick-leave"
            className="px-4 py-2 text-sm bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-xl hover:bg-neutral-700 hover:text-white transition"
          >
            + New Sick Leave
          </Link>
        </div>
      )}
    </PageContainer>
  );
}
