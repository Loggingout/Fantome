// src/components/cards/EmployeeCard.tsx
import React from "react";
import type { Employee } from "../../types/employee";

const TOP_EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Jane Doe",
    role: "Product Designer",
    department: "Design",
    performance: 94,
    avatarColor: "#f97316",
  },
  {
    id: "2",
    name: "John Smith",
    role: "Senior Developer",
    department: "Engineering",
    performance: 91,
    avatarColor: "#22c55e",
  },
  {
    id: "3",
    name: "Alex Johnson",
    role: "Project Manager",
    department: "Operations",
    performance: 89,
    avatarColor: "#3b82f6",
  },
];

export default function EmployeeCard() {
  return (
    <div
      className="
        bg-neutral-900 border border-neutral-800
        rounded-2xl p-5 flex flex-col gap-3
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <p className="text-neutral-500 text-xs tracking-widest uppercase">
        Top Employees
      </p>

      <div className="mt-2 space-y-3">
        {TOP_EMPLOYEES.map((emp) => (
          <div
            key={emp.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-700"
                style={{ backgroundColor: emp.avatarColor }}
              >
                <span className="text-xs font-bold text-white">
                  {emp.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="text-sm text-white font-medium">
                  {emp.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {emp.role} · {emp.department}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-white font-semibold">
                {emp.performance}%
              </p>
              <p className="text-xs text-neutral-500">
                Performance
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
