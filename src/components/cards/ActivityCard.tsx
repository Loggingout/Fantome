import { useEffect, useState } from "react";
import api from "../../utils/api";

interface ActivityItem {
  id: string;
  type: "hire" | "update" | "role-change" | "login" | "leave-approved" | "leave-denied" | "employee-deleted";
  message: string;
  timestamp: string;
}

const typeColor: Record<string, string> = {
  hire: "text-emerald-400",
  update: "text-blue-400",
  login: "text-neutral-400",
  "role-change": "text-amber-400",
  "leave-approved": "text-emerald-400",
  "leave-denied": "text-red-400",
  "employee-deleted": "text-red-400",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ActivityCard() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard/activity")
      .then((res) => setActivity(res.data.activity))
      .catch((err) => console.error("ActivityCard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <p className="text-neutral-500 text-xs tracking-widest uppercase">
        Recent Activity
      </p>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading...</p>
      ) : activity.length === 0 ? (
        <p className="text-neutral-500 text-sm">No recent activity.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {activity.map((item) => (
            <li key={item.id} className="flex flex-col">
              <span className={`text-sm ${typeColor[item.type] ?? "text-white"}`}>
                {item.message}
              </span>
              <span className="text-xs text-neutral-600">
                {timeAgo(item.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


