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
    x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(55,65,81,0.3)" } },
    y: { ticks: { color: "#9ca3af", stepSize: 1 }, grid: { color: "rgba(55,65,81,0.3)" }, suggestedMin: 0 },
  },
};

export default function BlogAnalyticsChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/blog/all")
      .then((res) => {
        const posts = res.data.posts ?? [];
        // Group by YYYY-MM for last 6 months
        const now = new Date();
        const monthMap: Record<string, number> = {};
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          monthMap[key] = 0;
        }
        for (const p of posts) {
          const key = p.createdAt?.substring(0, 7);
          if (key && monthMap[key] !== undefined) monthMap[key]++;
        }
        setLabels(Object.keys(monthMap).map((k) => {
          const [y, m] = k.split("-");
          return new Date(parseInt(y), parseInt(m) - 1).toLocaleString("default", { month: "short" });
        }));
        setCounts(Object.values(monthMap));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-48 flex items-center justify-center text-neutral-500 text-sm">Loading…</div>;

  return (
    <div className="h-48">
      <Bar
        data={{
          labels,
          datasets: [{
            label: "Posts Published",
            data: counts,
            backgroundColor: "rgba(99,102,241,0.25)",
            borderColor: "#6366f1",
            borderWidth: 1,
            borderRadius: 4,
          }],
        }}
        options={options}
      />
    </div>
  );
}