import api from "../../../utils/api";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string | null;
  assignedTo: { name: string; email: string };
  assignedBy: { name: string };
  createdAt: string;
}

interface Props {
  tasks: Task[];
  onDeleted: () => void;
}

const priorityColor: Record<string, string> = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

const statusColor: Record<string, string> = {
  pending: "text-yellow-400",
  "in-progress": "text-blue-400",
  completed: "text-green-400",
};

export default function TaskTable({ tasks, onDeleted }: Props) {
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      onDeleted();
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  if (!tasks.length) {
    return <p className="text-neutral-500 text-sm">No tasks assigned yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-neutral-300">
        <thead className="text-neutral-500 border-b border-neutral-800">
          <tr>
            <th className="py-2 pr-4">Title</th>
            <th className="py-2 pr-4">Assigned To</th>
            <th className="py-2 pr-4">Priority</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Due</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="py-3 pr-4 text-white font-medium">{task.title}</td>
              <td className="py-3 pr-4">{task.assignedTo?.name}</td>
              <td className={`py-3 pr-4 capitalize ${priorityColor[task.priority]}`}>
                {task.priority}
              </td>
              <td className={`py-3 pr-4 capitalize ${statusColor[task.status]}`}>
                {task.status}
              </td>
              <td className="py-3 pr-4 text-neutral-500">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
              </td>
              <td className="py-3">
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-400 hover:text-red-300 text-xs transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
