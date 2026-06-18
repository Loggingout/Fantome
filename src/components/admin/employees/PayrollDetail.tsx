import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface EmployeePayroll {
  name: string;
  payType?: string;
  rate: number;
  hoursWorked: number;
  gross: number;
  net: number;
  taxes: number;
  deductions: number;
  payPeriod: string;
}

export default function PayrollDetail({ employee }: { employee: EmployeePayroll }) {
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors mb-5 w-fit"
      >
        <ChevronLeft className="w-4 h-4 shrink-0" />
        <span>Back</span>
      </button>

      <h2 className="text-xl font-serif text-white mb-1">Payroll Summary</h2>
      <p className="text-neutral-500 text-sm mb-5">{employee.payPeriod}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Employee</p>
          <p className="text-white font-medium">{employee.name}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Pay Type</p>
          <p className="text-white capitalize">{employee.payType ?? "Hourly"}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Rate / hr</p>
          <p className="text-white">${employee.rate}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Hours Worked</p>
          <p className="text-white">{employee.hoursWorked}h</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Gross Pay</p>
          <p className="text-emerald-400 font-semibold">${employee.gross.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Net Pay</p>
          <p className="text-white font-semibold">${employee.net.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Taxes (est.)</p>
          <p className="text-red-400">−${employee.taxes.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Deductions</p>
          <p className="text-amber-400">−${employee.deductions.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
