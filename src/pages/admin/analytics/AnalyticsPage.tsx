import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import api from "../../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../../components/layout/PageContainer";
import AttendanceFilters, {
  type AttendanceFiltersState,
} from "../../../components/admin/analytics/AttendanceFilters";
import AttendanceSummaryTable, {
  type AttendanceRecord,
} from "../../../components/admin/analytics/AttendanceSummaryTable";
import EmployeeRate from "../../../components/admin/employees/EmployeeRate";

export default function AnalyticsPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AttendanceFiltersState>({
    startDate: "",
    endDate: "",
    status: "",
    search: "",
  });
  const [ratesOpen, setRatesOpen] = useState(false);

  // Clock correction modal
  const [correcting, setCorrecting] = useState<AttendanceRecord | null>(null);
  const [correction, setCorrection] = useState({ clockIn: "", clockOut: "", lunchStart: "", lunchEnd: "", reason: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Extract UTC HH:MM from an ISO string for time inputs
  const toUTCTime = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  };

  const openCorrection = (record: AttendanceRecord) => {
    setCorrecting(record);
    setSaveError("");
    setCorrection({
      clockIn: toUTCTime(record.clockIn),
      clockOut: toUTCTime(record.clockOut),
      lunchStart: toUTCTime(record.lunchStart),
      lunchEnd: toUTCTime(record.lunchEnd),
      reason: "",
    });
  };

  const submitCorrection = async () => {
    if (!correcting) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await api.patch(`/attendance/${correcting._id}/correct`, correction);
      setRecords((prev) =>
        prev.map((r) => (r._id === correcting._id ? res.data.record : r))
      );
      setCorrecting(null);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || "Failed to save correction.");
    } finally {
      setSaving(false);
    }
  };

  // Re-fetch when date range changes (server-side filtering for performance)
  const fetchRecords = (quiet = false) => {
    if (!quiet) setLoading(true);
    const params = new URLSearchParams();
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    api
      .get(`/attendance/admin/summary?${params}`)
      .then((res) => setRecords(res.data.summary ?? []))
      .catch(console.error)
      .finally(() => { if (!quiet) setLoading(false); });
  };

  useEffect(() => {
    fetchRecords();
  }, [filters.startDate, filters.endDate]);

  // Unique employees across all loaded records (not just filtered)
  const uniqueEmployees = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ _id: string; name: string; hourlyRate: number }> = [];
    for (const r of records) {
      if (!r.employee) continue;
      if (!seen.has(r.employee._id)) {
        seen.add(r.employee._id);
        list.push({ _id: r.employee._id, name: r.employee.name, hourlyRate: r.employee.hourlyRate });
      }
    }
    return list;
  }, [records]);

  // Status and name search are applied client-side for instant filtering
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filters.status && r.status !== filters.status) return false;
      if (
        filters.search &&
        !r.employee?.name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [records, filters.status, filters.search]);

  // When a rate is saved via EmployeeRate, immediately update matching rows then re-fetch
  const handleRateChange = (employeeId: string, newRate: number) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.employee?._id === employeeId
          ? {
              ...r,
              employee: { ...r.employee, hourlyRate: newRate },
              payout: Math.round(r.hoursWorked * newRate * 100) / 100,
            }
          : r
      )
    );
    fetchRecords(true);
  };

  return (
    <>
    <PageContainer>
      <SectionHeader title="Attendance & Payroll Analytics" />

      {/* ── Employee Pay Rates ─────────────────────────────────────── */}
      {uniqueEmployees.length > 0 && (
        <DashCard className="p-5 mb-2">
          <button
            onClick={() => setRatesOpen((o) => !o)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-white font-semibold text-sm">
              Employee Pay Rates
            </span>
            <svg
              className={`w-4 h-4 text-neutral-500 transition-transform ${ratesOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {ratesOpen && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueEmployees.map((emp) => (
                <EmployeeRate
                  key={emp._id}
                  employeeId={emp._id}
                  currentRate={emp.hourlyRate}
                  employeeName={emp.name}
                  onSaved={(rate) => handleRateChange(emp._id, rate)}
                />
              ))}
            </div>
          )}
        </DashCard>
      )}

      {/* ── Attendance Table ───────────────────────────────────────── */}
      <DashCard className="p-6 flex flex-col gap-6">
        <AttendanceFilters filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="py-16 text-center text-neutral-500 text-sm">
            Loading records…
          </div>
        ) : (
          <AttendanceSummaryTable records={filtered} onCorrect={openCorrection} />
        )}
      </DashCard>
    </PageContainer>

      {/* ── Clock Correction Modal ─────────────────────────────────── */}
      {correcting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold text-lg">Correct Attendance</h3>
              <button onClick={() => setCorrecting(null)} className="p-1.5 text-neutral-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-neutral-500 text-sm mb-1">
              {correcting.employee.name} &middot; {correcting.date}
            </p>
            <p className="text-neutral-600 text-xs mb-5">
              Times are UTC. The employee will receive a notification.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Clock In (UTC)</label>
                <input type="time" value={correction.clockIn}
                  onChange={(e) => setCorrection((p) => ({ ...p, clockIn: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500" />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Clock Out (UTC)</label>
                <input type="time" value={correction.clockOut}
                  onChange={(e) => setCorrection((p) => ({ ...p, clockOut: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500" />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Lunch Start (UTC)</label>
                <input type="time" value={correction.lunchStart}
                  onChange={(e) => setCorrection((p) => ({ ...p, lunchStart: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500" />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Lunch End (UTC)</label>
                <input type="time" value={correction.lunchEnd}
                  onChange={(e) => setCorrection((p) => ({ ...p, lunchEnd: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500" />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-neutral-400 text-xs mb-1.5">Reason (sent to employee)</label>
              <input type="text" placeholder="e.g. System error, forgot to clock out…"
                value={correction.reason}
                onChange={(e) => setCorrection((p) => ({ ...p, reason: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600" />
            </div>

            {saveError && (
              <p className="text-red-400 text-xs mb-4">{saveError}</p>
            )}

            <div className="flex gap-3">
              <button onClick={submitCorrection} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition disabled:opacity-50">
                {saving ? "Saving…" : "Save Correction"}
              </button>
              <button onClick={() => setCorrecting(null)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-semibold text-sm hover:bg-neutral-700 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
