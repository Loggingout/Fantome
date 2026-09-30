import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
  PlatformStatus,
  PlatformStatusRecord,
  StatusUpdatePayload,
} from "../../../types/status";

interface UpdateStatusModalProps {
  isOpen: boolean;
  platform: PlatformStatusRecord | null;
  onClose: () => void;
  onSubmit: (
    payload: StatusUpdatePayload,
  ) => void | Promise<void>;
  isSaving?: boolean;
}

const STATUS_OPTIONS: Array<{
  value: PlatformStatus;
  label: string;
}> = [
  {
    value: "operational",
    label: "Operational",
  },
  {
    value: "degraded",
    label: "Degraded Performance",
  },
  {
    value: "maintenance",
    label: "Maintenance",
  },
  {
    value: "outage",
    label: "Service Outage",
  },
  {
    value: "unknown",
    label: "Status Unknown",
  },
];

export default function UpdateStatusModal({
  isOpen,
  platform,
  onClose,
  onSubmit,
  isSaving = false,
}: UpdateStatusModalProps) {
  const [status, setStatus] = useState<PlatformStatus>("unknown");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!platform) {
      return;
    }

    setStatus(platform.status);
    setMessage(platform.message ?? "");
  }, [platform]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || !platform) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await onSubmit({
      status,
      message: message.trim() || undefined,
    });
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        py-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-status-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-2xl
          border
          border-neutral-800
          bg-neutral-900
          shadow-2xl
        "
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Update Platform Status
            </p>

            <h2
              id="update-status-title"
              className="mt-2 text-xl font-semibold text-white"
            >
              {platform.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="
              rounded-lg
              p-2
              text-neutral-500
              transition
              hover:bg-neutral-800
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="platform-status"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Status
            </label>

            <select
              id="platform-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as PlatformStatus)
              }
              disabled={isSaving}
              className="
                w-full
                rounded-xl
                border
                border-neutral-800
                bg-neutral-950
                px-4
                py-3
                text-sm
                text-white
                outline-none
                transition
                focus:border-neutral-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="platform-status-message"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              Status Message
            </label>

            <textarea
              id="platform-status-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isSaving}
              rows={5}
              placeholder="Optional message displayed alongside the status."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-neutral-800
                bg-neutral-950
                px-4
                py-3
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-neutral-600
                focus:border-neutral-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="
                rounded-xl
                border
                border-neutral-800
                bg-transparent
                px-5
                py-3
                text-sm
                font-medium
                text-neutral-300
                transition
                hover:border-neutral-700
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="
                rounded-xl
                border
                border-neutral-700
                bg-neutral-800
                px-5
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-neutral-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSaving ? "Saving..." : "Save Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}