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

export default function PayStubPreview({ employee }: { employee: EmployeePayroll }) {
  return (
    <div
      id="pay-stub-preview"
      className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 mt-6"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">Fantome Technologies</h3>
          <p className="text-neutral-500 text-sm">Pay Stub</p>
        </div>
        <div className="text-right">
          <p className="text-neutral-400 text-sm">Pay Period</p>
          <p className="text-white text-sm font-medium">{employee.payPeriod}</p>
        </div>
      </div>

      {/* Employee info */}
      <div className="border-t border-neutral-800 pt-4 mb-4">
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Employee</p>
        <p className="text-white font-semibold">{employee.name}</p>
      </div>

      {/* Earnings */}
      <div className="border-t border-neutral-800 pt-4 mb-4">
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-3">Earnings</p>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-300">Regular ({employee.hoursWorked}h × ${employee.rate}/hr)</span>
          <span className="text-white">${employee.gross.toFixed(2)}</span>
        </div>
      </div>

      {/* Deductions */}
      <div className="border-t border-neutral-800 pt-4 mb-4">
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-3">Deductions</p>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-300">Federal Tax (est.)</span>
          <span className="text-red-400">−${employee.taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-300">Other Deductions</span>
          <span className="text-amber-400">−${employee.deductions.toFixed(2)}</span>
        </div>
      </div>

      {/* Net */}
      <div className="border-t border-neutral-700 pt-4 flex justify-between">
        <span className="text-white font-semibold">Net Pay</span>
        <span className="text-emerald-400 font-bold text-lg">${employee.net.toFixed(2)}</span>
      </div>
    </div>
  );
}
