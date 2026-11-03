import { useState } from "react";
import { X } from "lucide-react";

import type {
  CreatePlatformPayload,
  PlatformStatus,
} from "../../../types/status";

interface AddPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePlatformPayload) => void | Promise<void>;
  isSaving?: boolean;
}

const STATUS_OPTIONS: Array<{ value: PlatformStatus; label: string }> = [
  { value: "operational", label: "Operational" },
  { value: "degraded", label: "Degraded Performance" },
  { value: "maintenance", label: "Maintenance" },
  { value: "outage", label: "Service Outage" },
  { value: "being_developed", label: "Being Developed" },
  { value: "unknown", label: "Status Unknown" },
];

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600 disabled:opacity-50";

export default function AddPlatformModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving = false,
}: AddPlatformModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("SaaS Platform");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<PlatformStatus>("unknown");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      name: name.trim(),
      category: category.trim(),
      description: description.trim() || undefined,
      status,
    });

    setName("");
    setDescription("");
    setStatus("unknown");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-platform-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-5">
          <h2
            id="add-platform-title"
            className="text-xl font-semibold text-white"
          >
            Add Platform
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-white disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSaving}
            placeholder="Platform name"
            className={inputClass}
          />

          <input
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={isSaving}
            placeholder="Category"
            className={inputClass}
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isSaving}
            rows={3}
            placeholder="Description"
            className={`${inputClass} resize-none`}
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as PlatformStatus)
            }
            disabled={isSaving}
            className={inputClass}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-neutral-800 px-4 py-2.5 text-sm text-neutral-300 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
            >
              {isSaving ? "Adding..." : "Add Platform"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
