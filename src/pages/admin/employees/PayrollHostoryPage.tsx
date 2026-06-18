import PayrollHistoryTable from "../../../components/admin/employees/PayrollHistoryTable";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

export default function PayrollHistoryPage() {
  return (
    <PageContainer>
      <SectionHeader title="Payroll Overview" />
      <DashCard className="p-6">
        <PayrollHistoryTable />
      </DashCard>
    </PageContainer>
  );
}
