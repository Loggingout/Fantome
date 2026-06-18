import { useEffect, useState } from "react";
import api from "../../../utils/api";
import TaskCard from "./TaskCard";

export default function MyTaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/mine");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Fetch my tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
    } catch (err) {
      console.error("Update task status error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="text-neutral-400 text-sm">Loading tasks...</p>;
  if (!tasks.length) return <p className="text-neutral-500 text-sm">No tasks assigned to you.</p>;

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
      ))}
    </div>
  );
}
