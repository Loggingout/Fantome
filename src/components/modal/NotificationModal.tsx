import React from "react";
import { X } from "lucide-react";

interface NotificationModalProps {
  onClose: () => void;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, message: "New user signed up", time: "2 min ago" },
  { id: 2, message: "Server backup completed", time: "10 min ago" },
  { id: 3, message: "New comment on blog post", time: "1 hour ago" },
  { id: 4, message: "Payment received", time: "3 hours ago" },
];

export default function NotificationModal({ onClose }: NotificationModalProps) {
  return (
    <div
      className="
        fixed inset-0 z-[999]
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

        {/* Notification List */}
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {MOCK_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="
                p-3 rounded-xl
                bg-neutral-800/40 border border-neutral-700
                hover:bg-neutral-800 transition
                flex flex-col gap-1
              "
            >
              <span className="text-white text-sm">{n.message}</span>
              <span className="text-neutral-500 text-xs">{n.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
}
