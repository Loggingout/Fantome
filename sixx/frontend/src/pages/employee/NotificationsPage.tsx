import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../components/layout/PageContainer";

interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/notifications/mine")
      .then((res) => {
        setNotifications(res.data.notifications);
        // Mark all as read after fetching
        api.patch("/notifications/read-all").catch(() => {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer>
      <SectionHeader title="Notifications" />

      <DashCard className="p-6">
        {loading ? (
          <p className="text-neutral-400 text-sm">Loading…</p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-neutral-500">
            <Bell className="w-8 h-8" />
            <p className="text-sm">No notifications yet.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-800">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`py-4 flex items-start gap-3 ${n.isRead ? "opacity-60" : ""}`}
              >
                <div
                  className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                    n.isRead ? "bg-neutral-700" : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="text-sm text-white">{n.message}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashCard>
    </PageContainer>
  );
}
