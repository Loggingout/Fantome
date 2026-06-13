// src/components/cards/StatsCard.tsx
import React from "react";

interface Trend {
  value: string;
  up: boolean;
}

interface StatsCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: Trend;
}

export default function StatsCard({ label, value, sub, trend }: StatsCardProps) {
  return (
    <div
      className="
        bg-neutral-900 border border-neutral-800
        rounded-2xl p-4 sm:p-5 flex flex-col gap-3
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        w-full
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Label */}
      <span className="text-neutral-500 text-[10px] sm:text-xs tracking-widest uppercase">
        {label}
      </span>

      {/* Value */}
      <span
        className="
          text-white 
          text-2xl sm:text-3xl 
          font-bold leading-none 
          break-words
        "
      >
        {value}
      </span>

      {/* Trend + Subtext */}
      <div
        className="
          flex flex-wrap items-center gap-2 
          mt-auto
        "
      >
        {trend && (
          <span
            className={`
              text-[10px] sm:text-xs font-medium 
              px-2 py-0.5 rounded-full
              ${
                trend.up
                  ? "bg-emerald-900/40 text-emerald-400"
                  : "bg-red-900/40 text-red-400"
              }
            `}
          >
            {trend.up ? "▲" : "▼"} {trend.value}
          </span>
        )}

        {sub && (
          <span className="text-neutral-600 text-[10px] sm:text-xs">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
