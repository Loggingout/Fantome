import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../utils/api";

interface Shift {
  _id: string;
  date: string;
  role: string;
  startTime: string;
  endTime: string;
}

export default function ScheduleCalendar() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [current, setCurrent] = useState(new Date());

  useEffect(() => {
    api
      .get("/shifts/mine")
      .then((res) => setShifts(res.data.shifts ?? []))
      .catch(console.error);
  }, []);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const shiftDates = new Set(
    shifts
      .filter((s) => {
        const [y, m] = s.date.split("-").map(Number);
        return y === year && m === month + 1;
      })
      .map((s) => parseInt(s.date.split("-")[2]))
  );

  const monthLabel = current.toLocaleString("default", { month: "long", year: "numeric" });

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayDate = new Date();
  const isToday = (d: number) =>
    d === todayDate.getDate() &&
    month === todayDate.getMonth() &&
    year === todayDate.getFullYear();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold font-serif">{monthLabel}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrent(new Date(year, month - 1, 1))}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrent(new Date(year, month + 1, 1))}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-neutral-600 text-xs py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs ${
              !day
                ? ""
                : isToday(day)
                ? "bg-white text-black font-bold"
                : shiftDates.has(day)
                ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800/40"
                : "text-neutral-400 hover:bg-neutral-800 transition"
            }`}
          >
            {day ?? ""}
            {day && shiftDates.has(day) && !isToday(day) && (
              <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
            )}
          </div>
        ))}
      </div>

      <p className="text-neutral-600 text-xs mt-3">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
        Scheduled shift
      </p>
    </div>
  );
}