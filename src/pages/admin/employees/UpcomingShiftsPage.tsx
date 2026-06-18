import { useEffect, useState } from "react";
import api from "../../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";
import AddShiftForm from "../../../components/admin/shifts/AddShiftForm";
import ShiftTable from "../../../components/admin/shifts/ShiftTable";

export default function UpcomingShiftsPage() {
  const [shifts, setShifts] = useState([]);

  const fetchShifts = async () => {
    try {
      const res = await api.get("/shifts");
      setShifts(res.data.shifts);
    } catch (err) {
      console.error("Fetch shifts error:", err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <PageContainer>
      <SectionHeader title="Upcoming Shifts" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Shift Form */}
        <DashCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Schedule a Shift</h3>
          <AddShiftForm onCreated={fetchShifts} />
        </DashCard>

        {/* Shift Table */}
        <div className="lg:col-span-2">
          <DashCard className="p-6">
            <h3 className="text-white font-semibold mb-4">All Scheduled Shifts</h3>
            <ShiftTable shifts={shifts} onDeleted={fetchShifts} />
          </DashCard>
        </div>
      </div>
    </PageContainer>
  );
}
