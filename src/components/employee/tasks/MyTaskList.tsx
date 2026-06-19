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
    // Optimistic update — apply immediately so the controlled select reflects
    // the new value before the async request completes.
    const prev = tasks.find((t) => t._id === id)?.status ?? "";
    setTasks((ts) => ts.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      // Remove completed tasks from the list after a short delay
      if (status === "completed") {
        setTimeout(() => {
          setTasks((ts) => ts.filter((t) => t._id !== id));
        }, 1200);
      }
    } catch (err) {
      console.error("Update task status error:", err);
      // Revert to previous status on failure
      setTasks((ts) => ts.map((t) => (t._id === id ? { ...t, status: prev } : t)));
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
