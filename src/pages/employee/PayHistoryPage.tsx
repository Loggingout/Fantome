import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../components/layout/PageContainer";
import PayrollHistoryTable from "../../components/tables/PayrollHistoryTable";
import HoursWorkedChart from "../../components/charts/HoursWorkedChart";
import AttendanceTable from "../../components/tables/AttendanceTable";

export default function PayHistoryPage() {
  return (
    <PageContainer>
      <SectionHeader title="Pay History" />

      <div className="flex flex-col gap-6">
        {/* Hours Worked Chart */}
        <DashCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Hours Worked — Last 14 Days</h3>
          <HoursWorkedChart />
        </DashCard>

        {/* Payroll History Table */}
        <PayrollHistoryTable />

        {/* Detailed Attendance Records */}
        <AttendanceTable />
      </div>
    </PageContainer>
  );
}
