import { useState } from "react";
import api from "../../../utils/api";

interface Props {
  employeeId: string;
  currentRate?: number;
  onSaved?: (rate: number) => void;
}

export default function EmployeeRate({ employeeId, currentRate = 0, onSaved }: Props) {
  const [rate, setRate] = useState(String(currentRate));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const val = parseFloat(rate);
    if (isNaN(val) || val < 0) return;
    setSaving(true);
    try {
      await api.patch(`/admin/employees/${employeeId}/rate`, { hourlyRate: val });
      onSaved?.(val);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl font-serif text-white mb-4">Employee Pay Rate</h2>
      <div className="flex flex-col gap-4 max-w-sm">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">$</span>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Hourly Rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition"
          />
          <span className="text-neutral-500 text-sm">/hr</span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "Saved!" : "Save Rate"}
        </button>
      </div>
    </div>
  );
}
