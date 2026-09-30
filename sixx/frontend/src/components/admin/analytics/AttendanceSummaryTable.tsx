import { Fragment, useMemo } from "react";
import { Pencil } from "lucide-react";

export interface AttendanceRecord {
  _id: string;
  employee: {
    _id: string;
    name: string;
    email: string;
    hourlyRate: number;
    timezone?: string;
  };
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  lunchStart: string | null;
  lunchEnd: string | null;
  status: string;
  hoursWorked: number;
  payout: number;
  inBiweekPeriod?: boolean;
  biweekStart?: string;
  biweekEnd?: string;
  periodStart?: string;
  periodEnd?: string;
  periodIndex?: number;
  periodKey?: string;
}

interface Props {
  records: AttendanceRecord[];
  onCorrect?: (record: AttendanceRecord) => void;
}

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Format a "YYYY-MM-DD" string for display without any timezone shifting
function fmtDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  "clocked-in": "bg-emerald-500/20 text-emerald-400 border border-emerald-800/40",
  "on-break": "bg-amber-500/20 text-amber-400 border border-amber-800/40",
  "clocked-out": "bg-neutral-700/50 text-neutral-400 border border-neutral-700",
};

interface PeriodGroup {
  key: string;
  periodStart: string;
  periodEnd: string;
  isCurrent: boolean;
  rows: AttendanceRecord[];
}

interface EmployeeGroup {
  employee: AttendanceRecord["employee"];
  periods: PeriodGroup[];
}

const COL_COUNT_BASE = 7; // Date, Clock In, Clock Out, Hours, Status, Rate/hr, Est. Payout

export default function AttendanceSummaryTable({ records, onCorrect }: Props) {
  const totalHours = records.reduce((s, r) => s + r.hoursWorked, 0);
  const totalPayout = records.reduce((s, r) => s + r.payout, 0);
  const activeNow = records.filter(
    (r) => r.status === "clocked-in" || r.status === "on-break"
  ).length;
  const colCount = COL_COUNT_BASE + (onCorrect ? 1 : 0);

  // Group flat records into Employee → Bi-weekly Period → day rows,
  // so hours/payout are automatically subtotaled per 2-week pay cycle
  // instead of the admin having to add them up manually.
  const employeeGroups = useMemo<EmployeeGroup[]>(() => {
    const byEmployee = new Map<string, EmployeeGroup>();

    for (const r of records) {
      if (!byEmployee.has(r.employee._id)) {
        byEmployee.set(r.employee._id, { employee: r.employee, periods: [] });
      }
      const eg = byEmployee.get(r.employee._id)!;

      const periodStart = r.periodStart ?? r.date;
      const periodEnd = r.periodEnd ?? r.date;
      let period = eg.periods.find((p) => p.key === periodStart);
      if (!period) {
        period = {
          key: periodStart,
          periodStart,
          periodEnd,
          isCurrent: !!r.inBiweekPeriod,
          rows: [],
        };
        eg.periods.push(period);
      }
      period.rows.push(r);
    }

    // Sort periods most-recent-first within each employee, and employees alphabetically
    const groups = Array.from(byEmployee.values());
    for (const g of groups) {
      g.periods.sort((a, b) => b.periodStart.localeCompare(a.periodStart));
    }
    groups.sort((a, b) => a.employee.name.localeCompare(b.employee.name));
    return groups;
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center gap-2 text-neutral-600">
        <p className="text-sm">No attendance records found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700">
          <span className="text-neutral-500 text-xs">Total Hours</span>
          <span className="text-white text-sm font-semibold">
            {totalHours.toFixed(2)}h
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700">
          <span className="text-neutral-500 text-xs">Est. Total Payout</span>
          <span className="text-white text-sm font-semibold">
            ${totalPayout.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/30 border border-emerald-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-neutral-500 text-xs">Active Now</span>
          <span className="text-emerald-400 text-sm font-semibold">{activeNow}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700">
          <span className="text-neutral-500 text-xs">Records</span>
          <span className="text-white text-sm font-semibold">{records.length}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/40 border border-neutral-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-neutral-500 text-xs">= Current bi-weekly pay period</span>
        </div>
      </div>

      {/* Table — grouped by employee, then by bi-weekly pay period, with automatic subtotals */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full min-w-215 text-sm text-left">
          <thead>
            <tr className="bg-neutral-900/80 border-b border-neutral-800">
              <th className="px-4 py-3 text-neutral-500 font-medium">Date</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Clock In</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Clock Out</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Hours</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Status</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Rate / hr</th>
              <th className="px-4 py-3 text-neutral-500 font-medium">Est. Payout</th>
              {onCorrect && <th className="px-4 py-3 text-neutral-500 font-medium">Correct</th>}
            </tr>
          </thead>

          {employeeGroups.map((eg) => {
            const empHours = eg.periods.reduce(
              (s, p) => s + p.rows.reduce((s2, r) => s2 + r.hoursWorked, 0),
              0
            );
            const empPayout = eg.periods.reduce(
              (s, p) => s + p.rows.reduce((s2, r) => s2 + r.payout, 0),
              0
            );

            return (
              <tbody key={eg.employee._id} className="divide-y divide-neutral-800/60">
                {/* Employee header row */}
                <tr className="bg-neutral-900/60 border-t-2 border-neutral-700">
                  <td colSpan={colCount} className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-white font-semibold">{eg.employee.name}</p>
                        <p className="text-neutral-500 text-xs">{eg.employee.email}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-neutral-500">
                          {eg.employee.hourlyRate > 0 ? (
                            <span className="text-neutral-300">${eg.employee.hourlyRate}/hr</span>
                          ) : (
                            <span className="text-neutral-600 italic">rate not set</span>
                          )}
                        </span>
                        <span className="text-neutral-500">
                          Total: <span className="text-white font-semibold">{empHours.toFixed(2)}h</span>
                        </span>
                        <span className="text-neutral-500">
                          Payout: <span className="text-emerald-400 font-semibold">${empPayout.toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>

                {eg.periods.map((period) => {
                  const periodHours = period.rows.reduce((s, r) => s + r.hoursWorked, 0);
                  const periodPayout = period.rows.reduce((s, r) => s + r.payout, 0);
                  const daysWorked = period.rows.filter((r) => r.hoursWorked > 0).length;

                  return (
                    <Fragment key={period.key}>
                      {/* Period header — highlights the 2-week pay cycle this group belongs to */}
                      <tr
                        key={`${period.key}-header`}
                        className={
                          period.isCurrent
                            ? "bg-emerald-900/20 border-y border-emerald-800/40"
                            : "bg-neutral-800/30"
                        }
                      >
                        <td colSpan={colCount} className="px-4 py-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                period.isCurrent ? "bg-emerald-500" : "bg-neutral-600"
                              }`}
                            />
                            <span className={period.isCurrent ? "text-emerald-400 font-medium" : "text-neutral-400"}>
                              Pay Period: {fmtDate(period.periodStart)} – {fmtDate(period.periodEnd)}
                            </span>
                            {period.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wide">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Day rows within this pay period */}
                      {period.rows.map((r) => (
                        <tr key={r._id} className="hover:bg-neutral-800/30 transition-colors">
                          <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{r.date}</td>
                          <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{formatTime(r.clockIn)}</td>
                          <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{formatTime(r.clockOut)}</td>
                          <td className="px-4 py-3 text-white font-medium">
                            {r.hoursWorked > 0 ? `${r.hoursWorked.toFixed(2)}h` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                                STATUS_STYLES[r.status] ?? "bg-neutral-700 text-neutral-400"
                              }`}
                            >
                              {r.status.replace("-", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {r.employee.hourlyRate > 0 ? (
                              <span className="text-white text-sm">${r.employee.hourlyRate}/hr</span>
                            ) : (
                              <span className="text-neutral-600 text-xs italic">not set</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-emerald-400 font-medium">${r.payout.toFixed(2)}</span>
                          </td>
                          {onCorrect && (
                            <td className="px-4 py-3">
                              <button
                                onClick={() => onCorrect(r)}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-700 transition"
                                title="Correct clock times"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}

                      {/* Period subtotal — auto-calculated, no manual add-up needed */}
                      <tr
                        key={`${period.key}-subtotal`}
                        className={period.isCurrent ? "bg-emerald-900/10" : "bg-neutral-900/40"}
                      >
                        <td colSpan={3} className="px-4 py-2 text-neutral-500 text-xs uppercase tracking-wide">
                          Period Subtotal ({daysWorked} day{daysWorked !== 1 ? "s" : ""})
                        </td>
                        <td className="px-4 py-2 text-white font-semibold text-sm">
                          {periodHours.toFixed(2)}h
                        </td>
                        <td />
                        <td />
                        <td className="px-4 py-2 text-emerald-400 font-semibold text-sm">
                          ${periodPayout.toFixed(2)}
                        </td>
                        {onCorrect && <td />}
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            );
          })}

          {/* Grand totals footer */}
          <tfoot>
            <tr className="bg-neutral-900/60 border-t-2 border-neutral-700">
              <td
                colSpan={3}
                className="px-4 py-3 text-neutral-500 text-xs uppercase tracking-wider"
              >
                Grand Total ({records.length} record{records.length !== 1 ? "s" : ""})
              </td>
              <td className="px-4 py-3 text-white font-semibold">
                {totalHours.toFixed(2)}h
              </td>
              <td />
              <td />
              <td className="px-4 py-3 text-emerald-400 font-semibold">
                ${totalPayout.toFixed(2)}
              </td>
              {onCorrect && <td />}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
