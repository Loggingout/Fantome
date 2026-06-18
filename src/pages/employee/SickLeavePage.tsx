import { useState } from "react";
import api from "../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../components/layout/PageContainer";

export default function SickLeavePage() {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ startDate: today, endDate: today, reason: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/leave", { type: "sick", ...form });
      setSuccess(true);
      setForm({ startDate: today, endDate: today, reason: "" });
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionHeader title="Sick Leave Request" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <DashCard className="p-6">
          <h3 className="text-white font-semibold mb-1">Submit a Sick Leave Request</h3>
          <p className="text-neutral-500 text-sm mb-5">
            Your request will be reviewed by an admin. You\'ll receive a notification once a decision is made.
          </p>

          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 text-sm">
              Request submitted successfully. An admin will review it shortly.
            </div>
          )}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-800/40 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <div>
              <label className="block text-neutral-400 text-xs mb-1.5">Reason (optional)</label>
              <textarea
                rows={3}
                placeholder="Describe your symptoms or reason for absence…"
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

        {/* Info panel */}
        <DashCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Sick Leave Policy</h3>
          <div className="flex flex-col gap-4 text-sm text-neutral-400">
            <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
              <p className="text-white font-medium mb-1">Eligibility</p>
              <p>All active employees are eligible for sick leave from their first day of employment.</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
              <p className="text-white font-medium mb-1">Notification</p>
              <p>Submit your request as soon as possible. For same-day absences, contact your manager directly.</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
              <p className="text-white font-medium mb-1">Review Process</p>
              <p>An admin will approve or deny your request and you\'ll receive a notification with their decision.</p>
            </div>
          </div>
        </DashCard>
      </div>
    </PageContainer>
  );
}
