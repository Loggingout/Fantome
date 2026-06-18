import { useEffect, useState } from "react";
import api from "../../utils/api";

interface PayrollRecord {
  period: string;
  monthKey: string;
  daysWorked: number;
  totalHours: number;
  gross: number;
  net: number;
  rate: number;
}

export default function PayrollHistoryTable() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/attendance/my-payroll")
      .then((res) => setPayroll(res.data.payroll ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-serif text-white mb-4">Payroll History</h2>

      {loading ? (
        <p className="text-neutral-500 text-sm py-6 text-center">Loading payroll…</p>
      ) : payroll.length === 0 ? (
        <p className="text-neutral-500 text-sm py-6 text-center">
          No payroll records yet. Hours are calculated once you clock out.
        </p>
      ) : (
        <table className="w-full min-w-150 text-left">
          <thead>
            <tr className="text-neutral-400 text-sm border-b border-neutral-700">
              <th className="py-2 pr-6">Pay Period</th>
              <th className="py-2 pr-6">Days</th>
              <th className="py-2 pr-6">Hours</th>
              <th className="py-2 pr-6">Rate / hr</th>
              <th className="py-2 pr-6">Gross</th>
              <th className="py-2 pr-6">Net (est.)</th>
              <th className="py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((row) => (
              <>
                <tr
                  key={row.monthKey}
                  className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="py-3 pr-6 text-white font-medium">{row.period}</td>
                  <td className="py-3 pr-6 text-neutral-300">{row.daysWorked}</td>
                  <td className="py-3 pr-6 text-neutral-300">{row.totalHours.toFixed(2)}h</td>
                  <td className="py-3 pr-6 text-neutral-400">
                    {row.rate > 0 ? `$${row.rate}/hr` : <span className="text-neutral-600 text-xs">not set</span>}
                  </td>
                  <td className="py-3 pr-6 text-emerald-400 font-medium">${row.gross.toFixed(2)}</td>
                  <td className="py-3 pr-6 text-white">${row.net.toFixed(2)}</td>
                  <td className="py-3">
                    <button
                      onClick={() =>
                        setExpanded(expanded === row.monthKey ? null : row.monthKey)
                      }
                      className="bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-lg text-sm hover:bg-neutral-700 transition text-white"
                    >
                      {expanded === row.monthKey ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {expanded === row.monthKey && (
                  <tr key={`${row.monthKey}-detail`} className="bg-neutral-800/20">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                          <p className="text-neutral-500 text-xs mb-1">Gross Pay</p>
                          <p className="text-emerald-400 font-semibold">${row.gross.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-xs mb-1">Tax Est. (15%)</p>
                          <p className="text-red-400 font-semibold">
                            −${(row.gross - row.net).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-xs mb-1">Net Pay</p>
                          <p className="text-white font-semibold">${row.net.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-xs mb-1">Days Worked</p>
                          <p className="text-white">{row.daysWorked}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-xs mb-1">Total Hours</p>
                          <p className="text-white">{row.totalHours.toFixed(2)}h</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-xs mb-1">Hourly Rate</p>
                          <p className="text-white">
                            {row.rate > 0 ? `$${row.rate}/hr` : "Not configured"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
