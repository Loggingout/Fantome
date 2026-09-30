import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PayrollHistoryTable from "../../../components/admin/employees/PayrollHistoryTable";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

export default function PayrollHistoryPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/employees")}
        className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors mb-4 w-fit"
      >
        <ChevronLeft className="w-4 h-4 shrink-0" />
        <span>Back to Employees</span>
      </button>

      <SectionHeader title="Payroll Overview" />
      <DashCard className="p-6">
        <PayrollHistoryTable />
      </DashCard>
    </PageContainer>
  );
}
