import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Props {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number; // ms, 0 = no auto-close
}

const STYLES: Record<ToastType, { container: string; icon: React.ReactNode }> = {
  success: {
    container: "bg-neutral-900 border border-emerald-700/60 text-emerald-400",
    icon: <CheckCircle className="w-4 h-4 shrink-0" />,
  },
  error: {
    container: "bg-neutral-900 border border-red-700/60 text-red-400",
    icon: <AlertCircle className="w-4 h-4 shrink-0" />,
  },
  info: {
    container: "bg-neutral-900 border border-neutral-700 text-neutral-300",
    icon: <Info className="w-4 h-4 shrink-0" />,
  },
};

export default function ToastAlert({ message, type = "info", onClose, duration = 4000 }: Props) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const { container, icon } = STYLES[type];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm max-w-sm ${
        container
      }`}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {icon}
      <span className="flex-1 text-white">{message}</span>
      <button onClick={onClose} className="text-neutral-500 hover:text-white transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}