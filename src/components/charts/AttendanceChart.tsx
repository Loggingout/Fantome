import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../utils/api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const options: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: "#9ca3af", font: { family: "Georgia" } } } },
  scales: {
    x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(55,65,81,0.3)" } },
    y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(55,65,81,0.3)" }, suggestedMin: 0 },
  },
};

export default function AttendanceChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [hours, setHours] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/attendance/my-attendance")
      .then((res) => {
        const records = (res.data.records ?? []).slice(0, 7).reverse();
        setLabels(records.map((r: any) => r.date.slice(5)));
        setHours(records.map((r: any) => r.hoursWorked));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-48 flex items-center justify-center text-neutral-500 text-sm">Loading…</div>;
  if (!hours.length) return <div className="h-48 flex items-center justify-center text-neutral-500 text-sm">No attendance data yet.</div>;

  return (
    <div className="h-48">
      <Bar
        data={{
          labels,
          datasets: [{
            label: "Hours Worked",
            data: hours,
            backgroundColor: "rgba(16,185,129,0.25)",
            borderColor: "#10b981",
            borderWidth: 1,
            borderRadius: 4,
          }],
        }}
        options={options}
      />
    </div>
  );
}