import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import api from "../../utils/api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const options: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: "#9ca3af", font: { family: "Georgia" } },
      grid: { color: "rgba(55,65,81,0.3)" },
    },
    y: {
      ticks: { color: "#9ca3af", font: { family: "Georgia" } },
      grid: { color: "rgba(55,65,81,0.3)" },
      suggestedMin: 0,
    },
  },
};

export default function HoursWorkedChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/attendance/my-attendance")
      .then((res) => {
        const records = (res.data.records ?? []).slice(0, 14).reverse();
        setLabels(records.map((r: any) => r.date.slice(5)));
        setData(records.map((r: any) => r.hoursWorked));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-48 flex items-center justify-center text-neutral-500 text-sm">Loading…</div>;
  if (!data.length) return <div className="h-48 flex items-center justify-center text-neutral-500 text-sm">No data yet.</div>;

  return (
    <div className="h-48">
      <Bar
        data={{
          labels,
          datasets: [{
            label: "Hours Worked",
            data,
            backgroundColor: "rgba(229,229,229,0.15)",
            borderColor: "#e5e5e5",
            borderWidth: 1,
            borderRadius: 4,
          }],
        }}
        options={options}
      />
    </div>
  );
}