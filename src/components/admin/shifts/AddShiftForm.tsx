import { useEffect, useState } from "react";
import api from "../../../utils/api";

interface Employee {
  _id: string;
  name: string;
  role: string;
}

interface Props {
  onCreated: () => void;
}

export default function AddShiftForm({ onCreated }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    employee: "",
    role: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/employees").then((res) => {
      setEmployees(res.data.employees);
    });
  }, []);

  // Auto-fill role when employee is selected
  const handleEmployeeChange = (id: string) => {
    const emp = employees.find((e) => e._id === id);
    setForm({ ...form, employee: id, role: emp?.role || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/shifts", form);
      setForm({ employee: "", role: "", date: "", startTime: "", endTime: "", notes: "" });
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <select
        value={form.employee}
        onChange={(e) => handleEmployeeChange(e.target.value)}
        required
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      >
        <option value="">Select employee...</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.name} — {emp.role}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Role / Position"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        required
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      <div className="flex gap-3">
        <input
          type="time"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          required
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        />
        <input
          type="time"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          required
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        />
      </div>

      <input
        type="text"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Shift"}
      </button>
    </form>
  );
}
