import { useEffect, useState } from "react";
import api from "../../../utils/api";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  onCreated: () => void;
}

export default function AssignTaskForm({ onCreated }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/employees").then((res) => setEmployees(res.data.employees));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/tasks", form);
      setForm({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" });
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Task title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white resize-none"
      />

      <select
        value={form.assignedTo}
        onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
        required
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      >
        <option value="">Assign to employee...</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.name} — {emp.role}
          </option>
        ))}
      </select>

      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <input
        type="date"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
      >
        {loading ? "Assigning..." : "Assign Task"}
      </button>
    </form>
  );
}
