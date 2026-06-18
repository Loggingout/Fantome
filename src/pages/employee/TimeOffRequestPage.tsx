import { useState } from "react";
import api from "../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../components/layout/PageContainer";

const LEAVE_TYPES = [
  { value: "time-off", label: "Paid Time Off (PTO)" },
  { value: "sick", label: "Sick Leave" },
];

export default function TimeOffRequestPage() {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ type: "time-off", startDate: today, endDate: today, reason: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const days = form.startDate && form.endDate
    ? Math.max(1, Math.round((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86_400_000) + 1)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/leave", form);
      setSuccess(true);
      setForm({ type: "time-off", startDate: today, endDate: today, reason: "" });
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionHeader title="Time Off Request" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <DashCard className="p-6">
          <h3 className="text-white font-semibold mb-1">Request Time Off</h3>
          <p className="text-neutral-500 text-sm mb-5">
            Submit your request for review. You\'ll be notified once an admin responds.
          </p>

          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 text-sm">
              Request submitted! An admin will review it shortly.
            </div>
          )}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-800/40 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-neutral-400 text-xs mb-1.5">Leave Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500"
              >
                {LEAVE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Start Date</label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">End Date</label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  min={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            {days > 0 && (
              <p className="text-neutral-500 text-xs">
                Duration: <span className="text-white font-medium">{days} day{days !== 1 ? "s" : ""}</span>
              </p>
            )}

            <div>
              <label className="block text-neutral-400 text-xs mb-1.5">Reason (optional)</label>
              <textarea
                rows={3}
                placeholder="Add any details or notes for your manager…"
                value={form.reason}
                onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Submit Request"}
            </button>
          </form>
        </DashCard>

        {/* Summary panel */}
        <DashCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Time Off Guidelines</h3>
          <div className="flex flex-col gap-4 text-sm text-neutral-400">
            <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
              <p className="text-white font-medium mb-1">Advance Notice</p>
              <p>Please submit requests at least 2 weeks in advance for planned time off.</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
              <p className="text-white font-medium mb-1">Approval</p>
              <p>Requests are subject to team availability. You\'ll receive a notification once reviewed.</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
              <p className="text-white font-medium mb-1">Sick Leave</p>
              <p>For unplanned absences due to illness, use the <a href="/employee/sick-leave" className="text-white underline underline-offset-2">Sick Leave</a> page instead.</p>
            </div>
          </div>
        </DashCard>
      </div>
    </PageContainer>
  );
}
