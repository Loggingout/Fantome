import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import api from "../../../utils/api";
import PayrollDetail from "../../../components/admin/employees/PayrollDetail";
import PayStubPreview from "../../../components/admin/employees/PayStubPreview";
import PayPeriodAttendance from "../../../components/admin/employees/PayPeriodAttendance";
import DownloadPayStubButton from "../../../components/admin/employees/DownloadPayStubButton";
import EmployeeRate from "../../../components/admin/employees/EmployeeRate";
import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";

interface MonthPayroll {
  monthKey: string;
  label: string;
  totalHours: number;
  gross: number;
  net: number;
  daysWorked: number;
  details: { date: string; hours: number; clockIn: string | null; clockOut: string | null; status: string }[];
}

interface EmployeeInfo {
  _id: string;
  name: string;
  email: string;
  hourlyRate: number;
  role: string;
}

export default function EmployeePayrollDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [payroll, setPayroll] = useState<MonthPayroll[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rateRefreshing, setRateRefreshing] = useState(false);

  const fetchPayroll = (quiet = false) => {
    if (!employeeId) return;
    if (!quiet) setLoading(true);
    else setRateRefreshing(true);
    api
      .get(`/attendance/admin/employee/${employeeId}/payroll`)
      .then((res) => {
        setEmployee(res.data.employee);
        setPayroll(res.data.payroll ?? []);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setRateRefreshing(false);
      });
  };

  useEffect(() => {
    fetchPayroll();
  }, [employeeId]);

  const month = payroll[selected];

  const employeePayroll = employee && month ? {
    name: employee.name,
    payType: "hourly",
    rate: employee.hourlyRate,
    hoursWorked: month.totalHours,
    gross: month.gross,
    net: month.net,
    taxes: Math.round((month.gross - month.net) * 0.7 * 100) / 100,
    deductions: Math.round((month.gross - month.net) * 0.3 * 100) / 100,
    payPeriod: month.label,
  } : null;

  if (loading) return (
    <PageContainer>
      <p className="text-neutral-500 text-sm">Loading…</p>
    </PageContainer>
  );

  if (!employee) return (
    <PageContainer>
      <p className="text-neutral-500 text-sm">Employee not found.</p>
    </PageContainer>
  );

  return (
    <PageContainer>
      <button
        onClick={() => navigate("/admin/employees/payroll")}
        className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors mb-4 w-fit"
      >
        <ChevronLeft className="w-4 h-4 shrink-0" />
        <span>Back to Payroll Overview</span>
      </button>

      <SectionHeader title={`Payroll — ${employee.name}`} />

      {/* Pay period selector */}
      {payroll.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {payroll.map((m, i) => (
            <button
              key={m.monthKey}
              onClick={() => setSelected(i)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                i === selected
                  ? "bg-white text-black font-semibold"
                  : "bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {employeePayroll ? (
        <>
          <PayrollDetail employee={employeePayroll} />
          <PayStubPreview employee={employeePayroll} />
          <PayPeriodAttendance
            records={(month?.details ?? []).map((d) => ({ date: d.date, hours: d.hours }))}
          />
          <DownloadPayStubButton />
        </>
      ) : (
        <p className="text-neutral-500 text-sm mt-4">No payroll records found.</p>
      )}

      <div className="mt-8">
        <EmployeeRate
          employeeId={employee._id}
          currentRate={employee.hourlyRate}
          employeeName={employee.name}
          onSaved={(newRate) => {
            if (newRate === undefined) return;
            // Immediately recalculate every month using the new rate — no network wait
            setEmployee((prev) => prev ? { ...prev, hourlyRate: newRate } : prev);
            setPayroll((prev) =>
              prev.map((m) => {
                const gross = Math.round(m.totalHours * newRate * 100) / 100;
                const net   = Math.round(gross * 0.85 * 100) / 100;
                return { ...m, gross, net };
              })
            );
            // Background re-fetch for consistency
            fetchPayroll(true);
          }}
        />
      </div>
    </PageContainer>
  );
}
