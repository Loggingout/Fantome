import { useEffect, useState } from "react";
import api from "../../../utils/api";

interface LeaveRequest {
  _id: string;
  employee: { name: string; email: string };
  type: "sick" | "time-off";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "denied";
}

const TYPE_LABELS: Record<string, string> = {
  sick: "Sick Leave",
  "time-off": "Time Off",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 border border-amber-800/40",
  approved: "bg-emerald-500/20 text-emerald-400 border border-emerald-800/40",
  denied: "bg-red-500/20 text-red-400 border border-red-800/40",
};

export default function ApproveLeaveRequest() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/leave/all")
      .then((res) => setRequests(res.data.requests ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = async (id: string, status: "approved" | "denied") => {
    setUpdating(id);
    try {
      const res = await api.patch(`/leave/${id}/status`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: res.data.request.status } : r))
      );
    } catch (err) {
      console.error("Leave decision error:", err);
    } finally {
      setUpdating(null);
    }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl font-serif text-white mb-1">Leave Requests</h2>
      <p className="text-neutral-500 text-sm mb-5">
        {pending.length} pending · {resolved.length} resolved
      </p>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="text-neutral-600 text-sm">No leave requests yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {[...pending, ...resolved].map((req) => (
            <div
              key={req._id}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-semibold">{req.employee.name}</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[req.status]}`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-neutral-400 text-sm">
                  {TYPE_LABELS[req.type] ?? req.type} · {req.startDate} → {req.endDate}
                </p>
                {req.reason && (
                  <p className="text-neutral-500 text-xs mt-0.5">"{req.reason}"</p>
                )}
              </div>

              {req.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleDecision(req._id, "approved")}
                    disabled={updating === req._id}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(req._id, "denied")}
                    disabled={updating === req._id}
                    className="bg-red-700 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
