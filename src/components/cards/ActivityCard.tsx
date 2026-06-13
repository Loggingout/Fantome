// src/components/cards/ActivityCard.tsx
import React from "react";
import type { ActivityItem } from "../../types/employee";

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    type: "hire",
    message: "Hired Jane Doe as Product Designer",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "role-change",
    message: "Promoted John Smith to Senior Developer",
    timestamp: "Yesterday",
  },
  {
    id: "3",
    type: "login",
    message: "Alex Johnson logged in",
    timestamp: "2 days ago",
  },
  {
    id: "4",
    type: "update",
    message: "Updated salary band for Engineering",
    timestamp: "3 days ago",
  },
];

const typeColor: Record<ActivityItem["type"], string> = {
  hire: "text-emerald-400",
  update: "text-blue-400",
  login: "text-neutral-400",
  "role-change": "text-amber-400",
};

export default function ActivityCard() {
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
        Recent Activity
      </p>

      <ul className="mt-2 space-y-3">
        {MOCK_ACTIVITY.map((item) => (
          <li key={item.id} className="flex flex-col">
            <span className={`text-sm ${typeColor[item.type]}`}>
              {item.message}
            </span>
            <span className="text-xs text-neutral-600">
              {item.timestamp}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
