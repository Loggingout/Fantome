import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
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

type Filter = "all" | "pending" | "approved" | "denied";

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

const FILTER_TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "denied", label: "Denied" },
];

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [acting, setActing] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<{ id: string; action: "approved" | "denied" } | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    api.get("/leave/all")
      .then((res) => setRequests(res.data.requests))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openModal = (id: string, action: "approved" | "denied") => {
    setNote("");
    setNoteModal({ id, action });
  };

  const confirmDecision = async () => {
    if (!noteModal) return;
    setActing(noteModal.id);
    setNoteModal(null);
    try {
      await api.patch(`/leave/${noteModal.id}/status`, {
        status: noteModal.action,
        adminNote: note.trim() || undefined,
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === noteModal.id
            ? { ...r, status: noteModal.action, adminNote: note.trim() || r.adminNote }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActing(null);
    }
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts: Record<Filter, number> = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    denied: requests.filter((r) => r.status === "denied").length,
  };

  return (
    <PageContainer>
      <SectionHeader title="Leave Requests" />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
              filter === tab.key
                ? "bg-white text-black border-white"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white"
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === tab.key ? "bg-neutral-200 text-black" : "bg-neutral-800 text-neutral-400"}`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      <DashCard className="p-6">
        {loading ? (
          <p className="text-neutral-400 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-neutral-500 text-sm py-6 text-center">No {filter === "all" ? "" : filter} requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Employee</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Type</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Dates</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Days</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Reason</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Status</th>
                  <th className="pb-3 text-neutral-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((r) => (
                  <tr key={r._id}>
                    <td className="py-3.5 pr-6">
                      <p className="text-white font-medium">{r.employee.name}</p>
                      <p className="text-neutral-500 text-xs">{r.employee.email}</p>
                    </td>

                    <td className="py-3.5 pr-6">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          r.type === "sick"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {r.type === "sick" ? "Sick Leave" : "PTO"}
                      </span>
                    </td>

                    <td className="py-3.5 pr-6">
                      <p className="text-neutral-300 whitespace-nowrap">{fmtDate(r.startDate)}</p>
                      <p className="text-neutral-500 text-xs whitespace-nowrap">→ {fmtDate(r.endDate)}</p>
                    </td>

                    <td className="py-3.5 pr-6">
                      <span className="text-neutral-300">{workDays(r.startDate, r.endDate)}d</span>
                    </td>

                    <td className="py-3.5 pr-6 max-w-[200px]">
                      <p className="text-neutral-400 text-xs truncate">{r.reason || "—"}</p>
                      {r.adminNote && (
                        <p className="text-neutral-600 text-xs mt-0.5 truncate">Note: {r.adminNote}</p>
                      )}
                    </td>

                    <td className="py-3.5 pr-6">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                          r.status === "pending"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : r.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/15 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5">
                      {r.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(r._id, "approved")}
                            disabled={acting === r._id}
                            className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal(r._id, "denied")}
                            disabled={acting === r._id}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition disabled:opacity-50"
                            title="Deny"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-neutral-700 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>

      {/* Decision modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-white font-semibold text-lg mb-1">
              {noteModal.action === "approved" ? "Approve" : "Deny"} Request
            </h3>
            <p className="text-neutral-500 text-sm mb-5">
              Optionally add a note for the employee. They will be notified of your decision.
            </p>

            <label className="block text-neutral-400 text-xs mb-1.5">Admin Note (optional)</label>
            <textarea
              rows={3}
              placeholder="Leave blank or add a short explanation…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 resize-none mb-5"
            />

            <div className="flex gap-3">
              <button
                onClick={confirmDecision}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${
                  noteModal.action === "approved"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                {noteModal.action === "approved" ? "Approve" : "Deny"}
              </button>
              <button
                onClick={() => setNoteModal(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
