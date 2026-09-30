import { useState } from "react";
import api from "../../../utils/api";

interface Props {
  disabled?: boolean;
  onSuccess: () => void;
}

export default function ClockOutButton({ disabled, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClockOut = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/attendance/clock-out");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to clock out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClockOut}
        disabled={loading || disabled}
        className="w-full bg-red-500 text-black font-semibold rounded-xl py-4 hover:bg-red-400 transition disabled:opacity-50"
      >
        {loading ? "Clocking Out..." : "Clock Out"}
      </button>
      {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
