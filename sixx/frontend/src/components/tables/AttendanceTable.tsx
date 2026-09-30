import { useEffect, useState } from "react";
import api from "../../utils/api";
import AttendanceStatus from "../status/AttendanceStatus";

interface AttendanceRecord {
  _id: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: string;
  hoursWorked: number;
  payout: number;
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AttendanceTable() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/attendance/my-attendance")
      .then((res) => setRecords(res.data.records ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-serif text-white mb-4">Attendance Records</h2>

      {loading ? (
        <p className="text-neutral-500 text-sm py-6 text-center">Loading…</p>
      ) : records.length === 0 ? (
        <p className="text-neutral-500 text-sm py-6 text-center">No attendance records found.</p>
      ) : (
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-700">
              <th className="py-2 pr-6">Date</th>
              <th className="py-2 pr-6">Clock In</th>
              <th className="py-2 pr-6">Clock Out</th>
              <th className="py-2 pr-6">Hours</th>
              <th className="py-2 pr-6">Status</th>
              <th className="py-2">Est. Pay</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors">
                <td className="py-3 pr-6 text-white">{r.date}</td>
                <td className="py-3 pr-6 text-neutral-300">{fmt(r.clockIn)}</td>
                <td className="py-3 pr-6 text-neutral-300">{fmt(r.clockOut)}</td>
                <td className="py-3 pr-6 text-white font-medium">
                  {r.hoursWorked > 0 ? `${r.hoursWorked.toFixed(2)}h` : "—"}
                </td>
                <td className="py-3 pr-6">
                  <AttendanceStatus status={r.status} />
                </td>
                <td className="py-3 text-emerald-400">
                  {r.payout > 0 ? `$${r.payout.toFixed(2)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}