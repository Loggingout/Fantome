import { useEffect, useState } from "react";
import api from "../../../utils/api";

type OTStatus = "pending" | "approved" | "rejected";

interface OvertimeShift {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  otMultiplier: number;
  reason: string;
  notes: string;
  status: OTStatus;
}

const STATUS_STYLES: Record<OTStatus, string> = {
  pending: "bg-yellow-900/40 text-yellow-400",
  approved: "bg-emerald-900/40 text-emerald-400",
  rejected: "bg-red-900/40 text-red-400",
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function MyOvertimeShifts() {
  const [shifts, setShifts] = useState<OvertimeShift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/overtime-shifts/mine")
      .then((res) => setShifts(res.data.shifts))
      .catch((err) => console.error("Fetch my OT shifts error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-neutral-400 text-sm">Loading...</p>;
  if (!shifts.length)
    return <p className="text-neutral-500 text-sm">No overtime shifts assigned.</p>;

  return (
    <div className="flex flex-col gap-3">
      {shifts.map((shift) => (
        <div
          key={shift._id}
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <p className="text-white font-semibold">{shift.role}</p>
              <span className="text-xs text-amber-400 font-medium bg-amber-900/30 px-2 py-0.5 rounded-full">
                {shift.otMultiplier}× OT
              </span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[shift.status]}`}
            >
              {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
            </span>
          </div>

          <p className="text-neutral-400 text-sm">{formatDate(shift.date)}</p>
          <p className="text-neutral-400 text-sm">
            {shift.startTime} — {shift.endTime}
          </p>

          {shift.reason && (
            <p className="text-neutral-500 text-xs">Reason: {shift.reason}</p>
          )}
          {shift.notes && (
            <p className="text-neutral-500 text-xs">{shift.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
