interface Props {
  message: string;
  timestamp: string;
  isRead?: boolean;
  type?: string;
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

export default function NotificationItem({ message, timestamp, isRead = false }: Props) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition ${
        isRead
          ? "bg-neutral-800/20 border-neutral-800"
          : "bg-neutral-800/50 border-neutral-700"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${
          isRead ? "bg-neutral-600" : "bg-red-500"
        }`}
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm text-white leading-snug">{message}</p>
        <p className="text-xs text-neutral-500">{timeAgo(timestamp)}</p>
      </div>
    </div>
  );
}