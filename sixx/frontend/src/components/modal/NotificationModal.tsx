import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";
import api from "../../utils/api";

interface NotificationModalProps {
  onClose: () => void;
  onRead?: () => void; // optional callback so parent can clear badge
}

interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationModal({ onClose, onRead }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/notifications/mine")
      .then((res) => setNotifications(res.data.notifications))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Mark all as read and notify parent to clear badge
    api
      .patch("/notifications/read-all")
      .then(() => onRead?.())
      .catch(() => {});
  }, []);

  return (
    <div
      className="
        fixed inset-0 z-999
        bg-black/50 backdrop-blur-sm
        flex items-start justify-end
        p-4 sm:p-6
      "
      onClick={onClose}
    >
      {/* Modal Panel */}
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]
          w-full max-w-sm
          mt-0 sm:mt-2
          p-5 flex flex-col gap-4
          animate-fadeIn
        "
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-neutral-500 text-sm text-center py-6">Loading…</p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-neutral-600">
              <Bell className="w-7 h-7" />
              <p className="text-sm">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className="
                  p-3 rounded-xl
                  bg-neutral-800/40 border border-neutral-700/60
                  hover:bg-neutral-800 transition
                  flex items-start gap-3
                "
              >
                <div
                  className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${
                    n.isRead ? "bg-neutral-600" : "bg-red-500"
                  }`}
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-white text-sm leading-snug">{n.message}</span>
                  <span className="text-neutral-500 text-xs">{timeAgo(n.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
