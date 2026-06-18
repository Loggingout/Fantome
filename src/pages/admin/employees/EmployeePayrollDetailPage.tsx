import PayrollDetail from "../../../components/admin/employees/PayrollDetail";
import PayStubPreview from "../../../components/admin/employees/PayStubPreview";
import PayPeriodAttendance from "../../../components/admin/employees/PayPeriodAttendance";
import DownloadPayStubButton from "../../../components/admin/employees/DownloadPayStubButton";
import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";

export default function EmployeePayrollDetailPage() {
  const employee = {
    name: "John Doe",
    payType: "hourly",
    rate: 22,
    hoursWorked: 38,
    gross: 836,
    net: 720,
    taxes: 90,
    deductions: 26,
    payPeriod: "June 1 – June 15",
  };

  const attendance = [
    { date: "June 1", hours: 8 },
    { date: "June 2", hours: 7.5 },
    { date: "June 3", hours: 8 },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Employee Payroll Details" />

      <PayrollDetail employee={employee} />
      <PayStubPreview employee={employee} />
      <PayPeriodAttendance records={attendance} />
      <DownloadPayStubButton />
    </PageContainer>
  );
}
