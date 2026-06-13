// src/components/cards/AnalyticsCard.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Avg Performance",
      data: [78, 80, 82, 85, 86, 87],
      borderColor: "#e5e5e5",
      backgroundColor: "rgba(229,229,229,0.1)",
      tension: 0.35,
      pointRadius: 3,
    },
  ],
};

const options: any = {
  responsive: true,
  maintainAspectRatio: false, // ⭐ CRITICAL for mobile responsiveness
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: "#9ca3af", font: { family: "Georgia" } },
      grid: { color: "rgba(55,65,81,0.4)" },
    },
    y: {
      ticks: { color: "#9ca3af", font: { family: "Georgia" } },
      grid: { color: "rgba(55,65,81,0.4)" },
      suggestedMin: 60,
      suggestedMax: 100,
    },
  },
};

export default function AnalyticsCard() {
  return (
    <div
      className="
        bg-neutral-900 border border-neutral-800
        rounded-2xl p-5 flex flex-col gap-4
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        w-full
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-neutral-500 text-xs tracking-widest uppercase">
            Employee Performance
          </p>
          <p className="text-white text-lg font-semibold mt-1">
            Average Score Over Time
          </p>
        </div>

        <span className="text-xs text-neutral-500 whitespace-nowrap">
          Last 6 months
        </span>
      </div>

      {/* Chart Container */}
      <div
        className="
          relative
          h-48 sm:h-56 md:h-64 lg:h-72
          w-full
        "
      >
        <Line data={data} options={options} />
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-xs text-neutral-400 flex-wrap gap-2">
        <span>
          Current Avg:{" "}
          <span className="text-white font-semibold">87%</span>
        </span>
        <span>
          Change:{" "}
          <span className="text-emerald-400 font-semibold">+2%</span>
        </span>
      </div>
    </div>
  );
}
