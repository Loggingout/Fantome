import PageContainer, { SectionHeader, DashCard } from "../../components/layout/PageContainer";
import MyShifts from "../../components/employee/shifts/MyShifts";

export default function SchedulePage() {
  return (
    <PageContainer>
      <SectionHeader title="My Schedule" />
      <DashCard className="p-6">
        <h3 className="text-white font-semibold mb-4">Upcoming Shifts</h3>
        <MyShifts />
      </DashCard>
    </PageContainer>
  );
}
