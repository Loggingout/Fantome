import PayrollHistoryTable from "../../../components/admin/employees/PayrollHistoryTable";
import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";

export default function PayrollHistoryPage() {
  return (
    <PageContainer>
      <SectionHeader title="Payroll History" />
      <PayrollHistoryTable />
    </PageContainer>
  );
}
