import { useState } from "react";

export default function EmployeeRate() {
  const [rate, setRate] = useState("");

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl font-serif text-white mb-4">Employee Pay Rate</h2>

      <div className="flex flex-col gap-4 max-w-sm">
        <input
          type="number"
          placeholder="Hourly Rate ($)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        />

        <button className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition">
          Save Rate
        </button>
      </div>
    </div>
  );
}
