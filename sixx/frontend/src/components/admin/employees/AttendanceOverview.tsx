import { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function AttendanceOverview() {
  const [presentToday, setPresentToday] = useState(0);
  const [onBreak, setOnBreak] = useState(0);
  const [clockedOut, setClockedOut] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    api
      .get(`/attendance/admin/summary?startDate=${today}&endDate=${today}`)
      .then((res) => {
        const records = res.data.summary ?? [];
        setPresentToday(records.filter((r: any) => r.status === "clocked-in").length);
        setOnBreak(records.filter((r: any) => r.status === "on-break").length);
        setClockedOut(records.filter((r: any) => r.status === "clocked-out").length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Clocked In", value: presentToday, color: "text-emerald-400" },
    { label: "On Break", value: onBreak, color: "text-amber-400" },
    { label: "Clocked Out", value: clockedOut, color: "text-neutral-300" },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl font-serif text-white mb-4">Today’s Attendance</h2>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
              <p className="text-neutral-400 text-sm mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
