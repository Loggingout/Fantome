import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

type ViewMode = "month" | "biweekly" | "alltime";

interface EmployeeSummary {
  employee: {
    _id: string;
    name: string;
    email: string;
    hourlyRate: number;
    employmentType: string;
    isActive: boolean;
    hireDate: string | null;
  };
  daysWorked: number;
  daysEmployed: number;
  // All-time
  allTimeHours: number;
  allTimeGross: number;
  allTimeNet: number;
  // Current month
  monthHours: number;
  monthGross: number;
  monthNet: number;
  // Current bi-weekly period
  biweekHours: number;
  biweekGross: number;
  biweekNet: number;
  biweekStart: string;
  biweekEnd: string;
  rate: number;
}

const EMPLOYMENT_TYPE_COLORS: Record<string, string> = {
  "Full-time":    "bg-emerald-900/30 text-emerald-400",
  "Part-time":    "bg-blue-900/30 text-blue-400",
  "Seasonal":     "bg-amber-900/30 text-amber-400",
  "Intern":       "bg-neutral-700 text-neutral-300",
  "Not Employed": "bg-red-900/40 text-red-400",
};

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysToYearsMonths(days: number) {
  if (days < 1) return "< 1 day";
  const y = Math.floor(days / 365);
  const m = Math.floor((days % 365) / 30);
  const parts: string[] = [];
  if (y > 0) parts.push(`${y}y`);
  if (m > 0) parts.push(`${m}mo`);
  if (!parts.length) parts.push(`${days}d`);
  return parts.join(" ");
}

export default function PayrollHistoryTable() {
  const [summary, setSummary] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("month");
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
        No employees found. Add employees to see payroll data.
      </p>
    );

  // Totals for the footer
  const totalGross =
    view === "month"    ? summary.reduce((s, r) => s + r.monthGross,   0) :
    view === "biweekly" ? summary.reduce((s, r) => s + r.biweekGross,  0) :
                          summary.reduce((s, r) => s + r.allTimeGross, 0);
  const totalNet =
    view === "month"    ? summary.reduce((s, r) => s + r.monthNet,   0) :
    view === "biweekly" ? summary.reduce((s, r) => s + r.biweekNet,  0) :
                          summary.reduce((s, r) => s + r.allTimeNet, 0);
  const totalHours =
    view === "month"    ? summary.reduce((s, r) => s + r.monthHours,   0) :
    view === "biweekly" ? summary.reduce((s, r) => s + r.biweekHours,  0) :
                          summary.reduce((s, r) => s + r.allTimeHours, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* View toggle */}
      <div className="flex gap-1 rounded-xl border border-neutral-800 p-1 w-fit">
        {(["month", "biweekly", "alltime"] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              view === v ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-white"
            }`}
          >
            {v === "month" ? "This Month" : v === "biweekly" ? "Bi-weekly" : "All Time"}
          </button>
        ))}
      </div>

      {view === "biweekly" && summary[0] && (
        <p className="text-xs text-neutral-500">
          Current pay period: <span className="text-neutral-300">{fmtDate(summary[0].biweekStart)}</span>
          {" "}–{" "}
          <span className="text-neutral-300">{fmtDate(summary[0].biweekEnd)}</span>
          <span className="ml-2 text-neutral-600">(14-day bi-weekly cycle per employee hire date)</span>
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-neutral-900/80 border-b border-neutral-800">
              <th className="px-4 py-3 text-neutral-500 font-medium">Employee</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Type</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Tenure</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Days Worked</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Hours</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Rate / hr</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Gross</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Net (est.)</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {summary.map(({ employee: emp, daysWorked, daysEmployed, allTimeHours, allTimeGross, allTimeNet, monthHours, monthGross, monthNet, biweekHours, biweekGross, biweekNet, rate }) => {
              const hours = view === "month" ? monthHours : view === "biweekly" ? biweekHours : allTimeHours;
              const gross = view === "month" ? monthGross : view === "biweekly" ? biweekGross : allTimeGross;
              const net   = view === "month" ? monthNet   : view === "biweekly" ? biweekNet   : allTimeNet;

              return (
                <tr key={emp._id} className={`hover:bg-neutral-800/30 transition-colors ${!emp.isActive ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{emp.name}</p>
                    <p className="text-neutral-500 text-xs">{emp.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${EMPLOYMENT_TYPE_COLORS[emp.employmentType] ?? "bg-neutral-700 text-neutral-300"}`}>
                      {emp.employmentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">
                    {daysToYearsMonths(daysEmployed)}
                    {emp.hireDate && (
                      <p className="text-neutral-600 text-xs">{fmtDate(emp.hireDate)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{daysWorked}</td>
                  <td className="px-4 py-3 text-white font-medium">
                    {hours.toFixed(2)}h
                  </td>
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
              );
            })}
          </tbody>
          {/* Totals footer */}
          <tfoot>
            <tr className="border-t border-neutral-700 bg-neutral-900/60">
              <td className="px-4 py-3 text-neutral-400 font-medium" colSpan={4}>Total ({summary.length} employees)</td>
              <td className="px-4 py-3 text-white font-semibold">{totalHours.toFixed(2)}h</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-emerald-400 font-semibold">${totalGross.toFixed(2)}</td>
              <td className="px-4 py-3 text-white font-semibold">${totalNet.toFixed(2)}</td>
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
