interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string | null;
  assignedBy: { name: string };
  isRead: boolean;
}

interface Props {
  task: Task;
  onStatusChange: (id: string, status: string) => void;
}

const priorityColor: Record<string, string> = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

const statusStyle: Record<string, { dot: string; border: string; label: string }> = {
  pending:     { dot: "bg-amber-400",   border: "border-amber-500/40",  label: "Pending" },
  "in-progress": { dot: "bg-blue-400", border: "border-blue-500/40",   label: "In Progress" },
  completed:   { dot: "bg-emerald-400", border: "border-emerald-500/40", label: "Completed" },
};

export default function TaskCard({ task, onStatusChange }: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-white font-semibold">{task.title}</h4>
        {!task.isRead && (
          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full shrink-0">
            New
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-neutral-400 text-sm">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs mt-1">
        <span className="flex items-center gap-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full shrink-0 ${
              statusStyle[task.status]?.dot ?? "bg-neutral-500"
            }`}
          />
          <span className="text-neutral-400 capitalize">{task.status.replace("-", " ")}</span>
        </span>
        <span className={`capitalize ${priorityColor[task.priority]}`}>
          {task.priority} priority
        </span>
        {task.dueDate && (
          <span className="text-neutral-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        <span className="text-neutral-500">
          From: {task.assignedBy?.name}
        </span>
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        disabled={task.status === "completed"}
        className={`mt-2 bg-neutral-800 border rounded-lg px-3 py-2 text-white text-sm transition-colors ${
          task.status === "completed"
            ? "opacity-50 cursor-not-allowed border-emerald-500/40"
            : statusStyle[task.status]?.border ?? "border-neutral-700"
        }`}
      >
        {(["pending", "in-progress", "completed"] as const).map((s) => (
          <option key={s} value={s}>
            {statusStyle[s].label}
          </option>
        ))}
      </select>
    </div>
  );
}
