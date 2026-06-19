import { useEffect, useState, useMemo } from "react";
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
        r.employee._id === employeeId
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
          <AttendanceSummaryTable records={filtered} />
        )}
      </DashCard>
    </PageContainer>
  );
}
