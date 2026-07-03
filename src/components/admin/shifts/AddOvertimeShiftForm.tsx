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

const OT_MULTIPLIERS = [
  { label: "1.5× — Time & a Half", value: 1.5 },
  { label: "2.0× — Double Time", value: 2.0 },
];

export default function AddOvertimeShiftForm({ onCreated }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    employee: "",
    role: "",
    date: "",
    startTime: "",
    endTime: "",
    otMultiplier: 1.5,
    reason: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/employees").then((res) => setEmployees(res.data.employees));
  }, []);

  const handleEmployeeChange = (id: string) => {
    const emp = employees.find((e) => e._id === id);
    setForm((f) => ({ ...f, employee: id, role: emp?.role || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.date || !form.startTime || !form.endTime) {
      setError("Date, start time, and end time are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/overtime-shifts", form);
      setForm({
        employee: "",
        role: "",
        date: "",
        startTime: "",
        endTime: "",
        otMultiplier: 1.5,
        reason: "",
        notes: "",
      });
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create OT shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Employee */}
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

      {/* Role */}
      <input
        type="text"
        placeholder="Role / Position"
        value={form.role}
        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
        required
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      {/* Date */}
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        required
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      {/* Time range */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="time"
          value={form.startTime}
          onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
          required
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        />
        <input
          type="time"
          value={form.endTime}
          onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
          required
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        />
      </div>

      {/* OT Multiplier */}
      <select
        value={form.otMultiplier}
        onChange={(e) =>
          setForm((f) => ({ ...f, otMultiplier: Number(e.target.value) }))
        }
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      >
        {OT_MULTIPLIERS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Reason */}
      <input
        type="text"
        placeholder="Reason for overtime (e.g. product launch, deadline)"
        value={form.reason}
        onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      {/* Notes */}
      <textarea
        placeholder="Additional notes (optional)"
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        rows={2}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white resize-none"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition"
      >
        {loading ? "Scheduling…" : "Schedule OT Shift"}
      </button>
    </form>
  );
}
