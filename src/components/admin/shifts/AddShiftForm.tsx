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

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Returns all dates between start and end that fall on the given day indices
function generateRecurringDates(start: string, end: string, days: number[]): string[] {
  if (!start || !end || !days.length) return [];
  const dates: string[] = [];
  const current = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  while (current <= endDate) {
    if (days.includes(current.getDay())) {
      dates.push(current.toISOString().split("T")[0]);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function AddShiftForm({ onCreated }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [mode, setMode] = useState<"specific" | "recurring">("specific");

  // Shared fields
  const [sharedForm, setSharedForm] = useState({
    employee: "",
    role: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  // Specific dates mode
  const [dateInput, setDateInput] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Recurring mode
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/employees").then((res) => setEmployees(res.data.employees));
  }, []);

  const handleEmployeeChange = (id: string) => {
    const emp = employees.find((e) => e._id === id);
    setSharedForm({ ...sharedForm, employee: id, role: emp?.role || "" });
  };

  const addDate = () => {
    if (!dateInput || selectedDates.includes(dateInput)) return;
    setSelectedDates((prev) => [...prev, dateInput].sort());
    setDateInput("");
  };

  const removeDate = (d: string) =>
    setSelectedDates((prev) => prev.filter((x) => x !== d));

  const toggleDay = (day: number) =>
    setRecurringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const previewDates =
    mode === "recurring"
      ? generateRecurringDates(startDate, endDate, recurringDays)
      : selectedDates;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!previewDates.length) {
      setError(
        mode === "specific"
          ? "Add at least one date"
          : "Select days and a date range to generate shifts"
      );
      return;
    }

    setLoading(true);
    try {
      await api.post("/shifts", { ...sharedForm, dates: previewDates });
      // Reset
      setSharedForm({ employee: "", role: "", startTime: "", endTime: "", notes: "" });
      setSelectedDates([]);
      setRecurringDays([]);
      setStartDate("");
      setEndDate("");
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create shifts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Employee */}
      <select
        value={sharedForm.employee}
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
        value={sharedForm.role}
        onChange={(e) => setSharedForm({ ...sharedForm, role: e.target.value })}
        required
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      {/* Time range */}
      <div className="flex gap-3">
        <input
          type="time"
          value={sharedForm.startTime}
          onChange={(e) => setSharedForm({ ...sharedForm, startTime: e.target.value })}
          required
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        />
        <input
          type="time"
          value={sharedForm.endTime}
          onChange={(e) => setSharedForm({ ...sharedForm, endTime: e.target.value })}
          required
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        />
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border border-neutral-700">
        <button
          type="button"
          onClick={() => setMode("specific")}
          className={`flex-1 py-2 text-sm font-medium transition ${
            mode === "specific"
              ? "bg-neutral-700 text-white"
              : "bg-neutral-900 text-neutral-500 hover:text-white"
          }`}
        >
          Specific Dates
        </button>
        <button
          type="button"
          onClick={() => setMode("recurring")}
          className={`flex-1 py-2 text-sm font-medium transition ${
            mode === "recurring"
              ? "bg-neutral-700 text-white"
              : "bg-neutral-900 text-neutral-500 hover:text-white"
          }`}
        >
          Recurring Schedule
        </button>
      </div>

      {/* ── Specific dates mode ── */}
      {mode === "specific" && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
            />
            <button
              type="button"
              onClick={addDate}
              className="px-4 bg-neutral-700 text-white rounded-xl hover:bg-neutral-600 transition text-sm"
            >
              Add
            </button>
          </div>
          {selectedDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedDates.map((d) => (
                <span
                  key={d}
                  className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 text-white text-xs px-3 py-1 rounded-full"
                >
                  {new Date(d + "T00:00:00").toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  <button
                    type="button"
                    onClick={() => removeDate(d)}
                    className="text-neutral-400 hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Recurring mode ── */}
      {mode === "recurring" && (
        <div className="flex flex-col gap-3">
          {/* Day of week selector */}
          <div className="flex gap-1">
            {DAY_LABELS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => toggleDay(i)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
                  recurringDays.includes(i)
                    ? "bg-white text-black"
                    : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div className="flex gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
              placeholder="Start date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
              placeholder="End date"
            />
          </div>

          {/* Preview count */}
          {previewDates.length > 0 && (
            <p className="text-neutral-400 text-xs">
              {previewDates.length} shift{previewDates.length !== 1 ? "s" : ""} will be created
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      <input
        type="text"
        placeholder="Notes (optional)"
        value={sharedForm.notes}
        onChange={(e) => setSharedForm({ ...sharedForm, notes: e.target.value })}
        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : `Add ${previewDates.length || ""} Shift${previewDates.length !== 1 ? "s" : ""}`}
      </button>
    </form>
  );
}

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
