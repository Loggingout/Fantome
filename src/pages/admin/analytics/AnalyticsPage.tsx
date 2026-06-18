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

export default function AnalyticsPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AttendanceFiltersState>({
    startDate: "",
    endDate: "",
    status: "",
    search: "",
  });

  // Re-fetch when date range changes (server-side filtering for performance)
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    api
      .get(`/attendance/admin/summary?${params}`)
      .then((res) => setRecords(res.data.summary ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters.startDate, filters.endDate]);

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

  // When admin edits a rate inline, update all matching rows so payout recalculates
  const handleRateChange = (employeeId: string, rate: number) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.employee._id === employeeId
          ? {
              ...r,
              employee: { ...r.employee, hourlyRate: rate },
              payout: Math.round(r.hoursWorked * rate * 100) / 100,
            }
          : r
      )
    );
  };

  return (
    <PageContainer>
      <SectionHeader title="Attendance & Payroll Analytics" />

      <DashCard className="p-6 flex flex-col gap-6">
        <AttendanceFilters filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="py-16 text-center text-neutral-500 text-sm">
            Loading records…
          </div>
        ) : (
          <AttendanceSummaryTable
            records={filtered}
            onRateChange={handleRateChange}
          />
        )}
      </DashCard>
    </PageContainer>
  );
}
