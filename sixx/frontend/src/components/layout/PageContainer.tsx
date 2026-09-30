import React from "react";

// ── Reusable card shell ──────────────────────────────────────────────────────
export function DashCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-neutral-900 border border-neutral-800
        rounded-2xl p-5 flex flex-col gap-3
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; up: boolean };
}) {
  return (
    <DashCard>
      <span className="text-neutral-500 text-xs tracking-widest uppercase">
        {label}
      </span>
      <span className="text-white text-2xl sm:text-3xl font-bold leading-none">
        {value}
      </span>
      <div className="flex items-center gap-2 mt-auto">
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend.up
                ? "bg-emerald-900/40 text-emerald-400"
                : "bg-red-900/40 text-red-400"
            }`}
          >
            {trend.up ? "▲" : "▼"} {trend.value}
          </span>
        )}
        {sub && <span className="text-neutral-600 text-xs">{sub}</span>}
      </div>
    </DashCard>
  );
}

// ── Section header ───────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2
        className="text-white text-base font-semibold"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {title}
      </h2>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

// ── Main PageContainer ────────────────────────────────────────────────────────
interface PageContainerProps {
  children?: React.ReactNode;

  // Slot-based layout props — all optional, compose as needed
  statCards?: React.ReactNode;       // Row of 2–4 stat cards
  primaryPanel?: React.ReactNode;    // Tall left panel (e.g. chart, list)
  secondaryPanel?: React.ReactNode;  // Tall right panel (e.g. chart, summary)
  tableSection?: React.ReactNode;    // Full-width bottom table/activity section
  sidePanel?: React.ReactNode;       // Optional narrow right column
}

export default function PageContainer({
  children,
  statCards,
  primaryPanel,
  secondaryPanel,
  tableSection,
  sidePanel,
}: PageContainerProps) {
  // If no slots provided, fall back to rendering children in a plain wrapper
  const hasSlots = statCards || primaryPanel || secondaryPanel || tableSection;

  if (!hasSlots) {
    return (
      <div
        className="
          flex-1 min-h-screen bg-neutral-950
          p-4 sm:p-6 lg:p-8
          overflow-y-auto
        "
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="
        flex-1 min-h-screen bg-neutral-950
        p-4 sm:p-6 lg:p-8
        overflow-y-auto flex flex-col gap-5
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* ── Row 1: Stat cards ── */}
      {statCards && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards}
        </div>
      )}

      {/* ── Row 2: Primary + Secondary panels ── */}
      {(primaryPanel || secondaryPanel) && (
        <div
          className={`grid gap-4 ${
            primaryPanel && secondaryPanel
              ? sidePanel
                ? "grid-cols-1 lg:grid-cols-[1fr_1fr_300px]"
                : "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {primaryPanel && (
            <div className="flex flex-col gap-4">{primaryPanel}</div>
          )}
          {secondaryPanel && (
            <div className="flex flex-col gap-4">{secondaryPanel}</div>
          )}
          {sidePanel && (
            <div className="flex flex-col gap-4">{sidePanel}</div>
          )}
        </div>
      )}

      {/* ── Row 3: Full-width table / activity ── */}
      {tableSection && (
        <div className="w-full">{tableSection}</div>
      )}

      {/* Catch-all children */}
      {children}
    </div>
  );
}