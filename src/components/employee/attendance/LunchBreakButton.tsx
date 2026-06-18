import { useState } from "react";
import api from "../../../utils/api";

interface Props {
  onBreak: boolean;
  disabled?: boolean;
  onSuccess: () => void;
}

export default function LunchBreakButton({ onBreak, disabled, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleBreak = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post(onBreak ? "/attendance/lunch-end" : "/attendance/lunch-start");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update break");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={toggleBreak}
        disabled={loading || disabled}
        className={`w-full rounded-xl py-4 font-semibold transition disabled:opacity-50 ${
          onBreak
            ? "bg-yellow-500 text-black hover:bg-yellow-400"
            : "bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700"
        }`}
      >
        {loading ? "Updating..." : onBreak ? "End Lunch Break" : "Start Lunch Break"}
      </button>
      {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
