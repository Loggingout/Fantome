import { useEffect, useState } from "react";
import api from "../../../utils/api";

interface Shift {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  notes: string;
}

export default function MyShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/shifts/mine")
      .then((res) => setShifts(res.data.shifts))
      .catch((err) => console.error("Fetch my shifts error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-neutral-400 text-sm">Loading shifts...</p>;
  if (!shifts.length)
    return <p className="text-neutral-500 text-sm">No upcoming shifts scheduled.</p>;

  return (
    <div className="flex flex-col gap-3">
      {shifts.map((shift) => (
        <div
          key={shift._id}
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold">{shift.role}</p>
            <p className="text-neutral-400 text-sm">
              {new Date(shift.date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            {shift.startTime} — {shift.endTime}
          </p>
          {shift.notes && (
            <p className="text-neutral-500 text-xs mt-1">{shift.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
