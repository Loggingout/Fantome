import { useEffect, useState } from "react";
import api from "../../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
  StatCard,
} from "../../../components/layout/PageContainer";
import AddOvertimeShiftForm from "../../../components/admin/shifts/AddOvertimeShiftForm";
import OvertimeShiftTable from "../../../components/admin/shifts/OvertimeShiftTable";

export default function OvertimeShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);

  const fetchShifts = async () => {
    try {
      const res = await api.get("/overtime-shifts");
      setShifts(res.data.shifts);
    } catch (err) {
      console.error("Fetch OT shifts error:", err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const pending = shifts.filter((s) => s.status === "pending").length;
  const approved = shifts.filter((s) => s.status === "approved").length;
  const rejected = shifts.filter((s) => s.status === "rejected").length;

  return (
    <PageContainer>
      <SectionHeader title="Company Overtime" />

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Pending" value={String(pending)} />
        <StatCard label="Approved" value={String(approved)} />
        <StatCard label="Rejected" value={String(rejected)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add OT Shift Form */}
        <DashCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Schedule Overtime</h3>
          <AddOvertimeShiftForm onCreated={fetchShifts} />
        </DashCard>

        {/* OT Shift Table */}
        <div className="lg:col-span-2">
          <DashCard className="p-6">
            <h3 className="text-white font-semibold mb-4">All Overtime Shifts</h3>
            <OvertimeShiftTable shifts={shifts} onChanged={fetchShifts} />
          </DashCard>
        </div>
      </div>
    </PageContainer>
  );
}
