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

const STATUS_STYLES: Record<string, string> = {
  "clocked-in": "bg-emerald-500/20 text-emerald-400 border border-emerald-800/40",
  "on-break": "bg-amber-500/20 text-amber-400 border border-amber-800/40",
  "clocked-out": "bg-neutral-700/50 text-neutral-400 border border-neutral-700",
};

export default function AttendanceSummaryTable({ records, onCorrect }: Props) {
  const totalHours = records.reduce((s, r) => s + r.hoursWorked, 0);
  const totalPayout = records.reduce((s, r) => s + r.payout, 0);
  const activeNow = records.filter(
    (r) => r.status === "clocked-in" || r.status === "on-break"
  ).length;

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
      </div>

      {/* Table — horizontal scroll on small screens */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full min-w-[860px] text-sm text-left">
          <thead>
            <tr className="bg-neutral-900/80 border-b border-neutral-800">
              <th className="px-4 py-3 text-neutral-500 font-medium">Employee</th>
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
          <tbody className="divide-y divide-neutral-800/60">
            {records.map((r) => {
              return (
                <tr
                  key={r._id}
                  className="hover:bg-neutral-800/30 transition-colors"
                >
                  {/* Employee */}
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{r.employee.name}</p>
                    <p className="text-neutral-500 text-xs">{r.employee.email}</p>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">
                    {r.date}
                  </td>

                  {/* Clock In */}
                  <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">
                    {formatTime(r.clockIn)}
                  </td>

                  {/* Clock Out */}
                  <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">
                    {formatTime(r.clockOut)}
                  </td>

                  {/* Hours */}
                  <td className="px-4 py-3 text-white font-medium">
                    {r.hoursWorked > 0 ? `${r.hoursWorked.toFixed(2)}h` : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        STATUS_STYLES[r.status] ??
                        "bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      {r.status.replace("-", " ")}
                    </span>
                  </td>

                  {/* Rate — read-only; edit via "Employee Pay Rates" above */}
                  <td className="px-4 py-3">
                    {r.employee.hourlyRate > 0 ? (
                      <span className="text-white text-sm">${r.employee.hourlyRate}/hr</span>
                    ) : (
                      <span className="text-neutral-600 text-xs italic">not set</span>
                    )}
                  </td>

                  {/* Payout */}
                  <td className="px-4 py-3">
                    <span className="text-emerald-400 font-medium">
                      ${r.payout.toFixed(2)}
                    </span>
                  </td>

                  {/* Correct button */}
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
              );
            })}
          </tbody>

          {/* Totals footer */}
          <tfoot>
            <tr className="bg-neutral-900/60 border-t border-neutral-700">
              <td
                colSpan={4}
                className="px-4 py-3 text-neutral-500 text-xs uppercase tracking-wider"
              >
                Totals ({records.length} record{records.length !== 1 ? "s" : ""})
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
