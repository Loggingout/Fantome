import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import RoleBadge from "../../status/RoleBadge";

interface EmployeeSummary {
  employee: { _id: string; name: string; email: string; hourlyRate: number; role: string };
  daysWorked: number;
  totalHours: number;
  gross: number;
  net: number;
  rate: number;
}

export default function PayrollHistoryTable() {
  const [summary, setSummary] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/attendance/admin/payroll")
      .then((res) => setSummary(res.data.summary ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-neutral-500 text-sm py-6 text-center">Loading payroll data…</p>;

  if (summary.length === 0)
    return (
      <p className="text-neutral-500 text-sm py-6 text-center">
        No payroll data yet. Employees need to clock in and have an hourly rate set.
      </p>
    );

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800">
      <table className="w-full min-w-150 text-sm text-left">
        <thead>
          <tr className="bg-neutral-900/80 border-b border-neutral-800">
            <th className="px-4 py-3 text-neutral-500 font-medium">Employee</th>
            <th className="px-4 py-3 text-neutral-500 font-medium">Role</th>
            <th className="px-4 py-3 text-neutral-500 font-medium">Days</th>
            <th className="px-4 py-3 text-neutral-500 font-medium">Total Hours</th>
            <th className="px-4 py-3 text-neutral-500 font-medium">Rate / hr</th>
            <th className="px-4 py-3 text-neutral-500 font-medium">Gross</th>
            <th className="px-4 py-3 text-neutral-500 font-medium">Net (est.)</th>
            <th className="px-4 py-3 text-neutral-500 font-medium">Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {summary.map(({ employee: emp, daysWorked, totalHours, gross, net, rate }) => (
            <tr key={emp._id} className="hover:bg-neutral-800/30 transition-colors">
              <td className="px-4 py-3">
                <p className="text-white font-medium">{emp.name}</p>
                <p className="text-neutral-500 text-xs">{emp.email}</p>
              </td>
              <td className="px-4 py-3">
                <RoleBadge role={emp.role} />
              </td>
              <td className="px-4 py-3 text-neutral-300">{daysWorked}</td>
              <td className="px-4 py-3 text-white font-medium">{totalHours.toFixed(2)}h</td>
              <td className="px-4 py-3 text-neutral-400">
                {rate > 0 ? `$${rate}/hr` : <span className="text-neutral-600 text-xs">not set</span>}
              </td>
              <td className="px-4 py-3 text-emerald-400 font-medium">${gross.toFixed(2)}</td>
              <td className="px-4 py-3 text-white">${net.toFixed(2)}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => navigate(`/admin/employees/${emp._id}/payroll`)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
