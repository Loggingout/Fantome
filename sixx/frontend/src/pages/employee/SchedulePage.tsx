import PageContainer, { SectionHeader, DashCard } from "../../components/layout/PageContainer";
import MyShifts from "../../components/employee/shifts/MyShifts";
import MyOvertimeShifts from "../../components/employee/shifts/MyOvertimeShifts";

export default function SchedulePage() {
  return (
    <PageContainer>
      <SectionHeader title="My Schedule" />

      <DashCard className="p-6">
        <h3 className="text-white font-semibold mb-4">Upcoming Shifts</h3>
        <MyShifts />
      </DashCard>

      <DashCard className="p-6">
        <h3 className="text-white font-semibold mb-1">Overtime Shifts</h3>
        <p className="text-neutral-500 text-xs mb-4">
          Overtime is paid at the rate shown. Shifts marked <span className="text-yellow-400">Pending</span> are awaiting approval.
        </p>
        <MyOvertimeShifts />
      </DashCard>
    </PageContainer>
  );
}
