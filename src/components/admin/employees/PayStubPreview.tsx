import Logo from "/new-logo.png";

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
      className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 border border-purple-900/40 rounded-2xl p-6 sm:p-8 mt-6 shadow-[0_8px_40px_rgba(139,92,246,0.15)]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Subtle brand grid pattern overlay, matching the site hero */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.08)_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Fantome Technologies Logo" className="h-10 w-auto rounded-lg" />
            <div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Fantome Technologies
              </h3>
              <p className="text-purple-300/70 text-sm">Pay Stub</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-purple-300/70 text-sm">Pay Period</p>
            <p className="text-white text-sm font-medium">{employee.payPeriod}</p>
          </div>
        </div>

        {/* Employee info */}
        <div className="mb-4">
          <p className="text-purple-300/70 text-xs uppercase tracking-wider mb-1">Employee</p>
          <p className="text-white font-semibold">{employee.name}</p>
        </div>

        {/* Earnings */}
        <div className="border-t border-purple-900/40 pt-4 mb-4">
          <p className="text-purple-300/70 text-xs uppercase tracking-wider mb-3">Earnings</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-200">Regular ({employee.hoursWorked}h × ${employee.rate}/hr)</span>
            <span className="text-white">${employee.gross.toFixed(2)}</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="border-t border-purple-900/40 pt-4 mb-4">
          <p className="text-purple-300/70 text-xs uppercase tracking-wider mb-3">Deductions</p>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-200">Federal Tax (est.)</span>
            <span className="text-pink-300">−${employee.taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-200">Other Deductions</span>
            <span className="text-pink-300">−${employee.deductions.toFixed(2)}</span>
          </div>
        </div>

        {/* Net */}
        <div className="border-t border-purple-800/60 pt-4 flex justify-between items-center">
          <span className="text-white font-semibold">Net Pay</span>
          <span className="bg-gradient-to-r from-purple-300 via-white to-pink-200 bg-clip-text text-transparent font-bold text-xl">
            ${employee.net.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
