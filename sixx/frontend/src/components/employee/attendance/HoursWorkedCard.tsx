import { useEffect, useState } from "react";

interface Props {
  clockIn: string | null;
  clockOut: string | null;
  lunchStart: string | null;
  lunchEnd: string | null;
}

function calcHours(clockIn: string | null, clockOut: string | null, lunchStart: string | null, lunchEnd: string | null): string {
  if (!clockIn) return "0h 00m";

  const start = new Date(clockIn).getTime();
  const end = clockOut ? new Date(clockOut).getTime() : Date.now();
  let worked = end - start;

  // Subtract lunch if applicable
  if (lunchStart && lunchEnd) {
    worked -= new Date(lunchEnd).getTime() - new Date(lunchStart).getTime();
  } else if (lunchStart && !lunchEnd) {
    worked -= Date.now() - new Date(lunchStart).getTime();
  }

  const totalMins = Math.max(0, Math.floor(worked / 60000));
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export default function HoursWorkedCard({ clockIn, clockOut, lunchStart, lunchEnd }: Props) {
  const [display, setDisplay] = useState(() => calcHours(clockIn, clockOut, lunchStart, lunchEnd));

  useEffect(() => {
    // Only tick in real-time if still clocked in
    if (!clockIn || clockOut) {
      setDisplay(calcHours(clockIn, clockOut, lunchStart, lunchEnd));
      return;
    }
    const interval = setInterval(() => {
      setDisplay(calcHours(clockIn, clockOut, lunchStart, lunchEnd));
    }, 10000);
    return () => clearInterval(interval);
  }, [clockIn, clockOut, lunchStart, lunchEnd]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h3 className="text-lg font-serif text-white mb-2">Hours Worked Today</h3>
      <p className="text-3xl font-bold text-white">{display}</p>
      <p className="text-neutral-400 text-sm mt-1">
        {clockIn ? (clockOut ? "Shift complete" : "Updated in real-time") : "Not clocked in yet"}
      </p>
    </div>
  );
}
