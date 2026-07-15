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
import CorrectionModal from "../../../components/admin/attendance/CorrectionModal";

export default function AnalyticsPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AttendanceFiltersState>({
    startDate: "",
    endDate: "",
    status: "",
    search: "",
  });

  // Clock correction modal
  const [correcting, setCorrecting] = useState<AttendanceRecord | null>(null);

  const openCorrection = (record: AttendanceRecord) => setCorrecting(record);

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

  // Status and name search are applied client-side for instant filtering
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (!r.employee) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (
        filters.search &&
        !r.employee.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !r.employee.email.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [records, filters.status, filters.search]);

  return (
    <>
    <PageContainer>
      <SectionHeader title="Attendance & Payroll Analytics" />

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

      <CorrectionModal
        record={correcting}
        onClose={() => setCorrecting(null)}
        onSaved={(updated) => {
          setRecords((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
        }}
      />
    </>
  );
}
