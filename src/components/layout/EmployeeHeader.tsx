import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import NotificationModal from "../modal/NotificationModal";
import api from "../../utils/api";

export default function EmployeeHeader({ title = "Dashboard" }: { title?: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    api
      .get("/notifications/mine")
      .then((res) => setUnreadCount(res.data.unreadCount ?? 0))
      .catch(() => {});
  }, []);

  return (
    <>
      <header
        className="
          w-full bg-neutral-950 border-b border-neutral-800
          px-4 sm:px-6 lg:px-8 py-4
          flex items-center justify-between
        "
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {/* Left: Title */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg sm:text-xl font-bold leading-tight truncate text-white">
            {title}
          </h1>
          <span className="text-neutral-500 text-xs sm:text-sm">
            {dateString}
          </span>
        </div>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotifications(true)}
            className="
              relative p-2 rounded-xl
              bg-neutral-900 border border-neutral-800
              text-neutral-500 hover:text-white hover:border-neutral-600
              transition-all duration-200
            "
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            )}
          </button>

          {/* Divider — hidden on mobile */}
          <div className="hidden sm:block w-px h-6 bg-neutral-800" />

          {/* Avatar */}
          <div
            className="
              w-8 h-8 rounded-full
              bg-neutral-800 border border-neutral-700
              flex items-center justify-center shrink-0
            "
          >
            <span className="text-white text-xs font-bold">EMP</span>
          </div>
        </div>
      </header>

      {showNotifications && (
        <NotificationModal
          onClose={() => setShowNotifications(false)}
          onRead={() => setUnreadCount(0)}
        />
      )}
    </>
  );
}
