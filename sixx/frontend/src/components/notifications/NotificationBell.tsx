import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../../utils/api";
import NotificationModal from "../modal/NotificationModal";

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api
      .get("/notifications/mine")
      .then((res) => setUnread(res.data.unreadCount ?? 0))
      .catch(() => {});
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-all duration-200"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <NotificationModal
          onClose={() => setOpen(false)}
          onRead={() => setUnread(0)}
        />
      )}
    </>
  );
}