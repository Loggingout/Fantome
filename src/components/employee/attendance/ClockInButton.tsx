import { useState } from "react";
import api from "../../../utils/api";

interface Props {
  disabled?: boolean;
  onSuccess: () => void;
}

export default function ClockInButton({ disabled, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClockIn = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/attendance/clock-in");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to clock in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClockIn}
        disabled={loading || disabled}
        className="w-full bg-green-500 text-black font-semibold rounded-xl py-4 hover:bg-green-400 transition disabled:opacity-50"
      >
        {loading ? "Clocking In..." : "Clock In"}
      </button>
      {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
