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
        className="mt-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
