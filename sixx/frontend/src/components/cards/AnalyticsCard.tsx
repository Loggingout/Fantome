// src/components/cards/AnalyticsCard.tsx
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import api from "../../utils/api";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: "#9ca3af", font: { family: "Georgia" } },
      grid: { color: "rgba(55,65,81,0.4)" },
    },
    y: {
      ticks: { color: "#9ca3af", font: { family: "Georgia" } },
      grid: { color: "rgba(55,65,81,0.4)" },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
};

export default function AnalyticsCard() {
  const [labels, setLabels] = useState<string[]>(["Jan","Feb","Mar","Apr","May","Jun"]);
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [current, setCurrent] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard/analytics")
      .then((res) => {
        setLabels(res.data.labels);
        setChartData(res.data.data);
        setCurrent(res.data.current);
        setChange(res.data.change);
      })
      .catch((err) => console.error("AnalyticsCard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Task Completion %",
        data: chartData,
        borderColor: "#e5e5e5",
        backgroundColor: "rgba(229,229,229,0.1)",
        tension: 0.35,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-[0_8px_40px_rgba(0,0,0,0.35)] w-full"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-neutral-500 text-xs tracking-widest uppercase">
            Task Completion Rate
          </p>
          <p className="text-white text-lg font-semibold mt-1">
            Performance Over Time
          </p>
        </div>
        <span className="text-xs text-neutral-500 whitespace-nowrap">Last 6 months</span>
      </div>

      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-500 text-sm">Loading chart...</p>
          </div>
        ) : (
          <Line data={data} options={chartOptions} />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400 flex-wrap gap-2">
        <span>
          Current Rate: <span className="text-white font-semibold">{current}%</span>
        </span>
        <span>
          Change:{" "}
          <span className={change >= 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        </span>
      </div>
    </div>
  );
}
