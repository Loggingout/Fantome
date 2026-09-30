import api from "../../../utils/api";

type OTStatus = "pending" | "approved" | "rejected";

interface OvertimeShift {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  otMultiplier: number;
  reason: string;
  notes: string;
  status: OTStatus;
  employee: { name: string; email: string };
}

interface Props {
  shifts: OvertimeShift[];
  onChanged: () => void;
}

const STATUS_STYLES: Record<OTStatus, string> = {
  pending: "bg-yellow-900/40 text-yellow-400",
  approved: "bg-emerald-900/40 text-emerald-400",
  rejected: "bg-red-900/40 text-red-400",
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString();
}

export default function OvertimeShiftTable({ shifts, onChanged }: Props) {
  const handleStatus = async (id: string, status: OTStatus) => {
    try {
      await api.patch(`/overtime-shifts/${id}/status`, { status });
      onChanged();
    } catch (err) {
      console.error("Update OT status error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/overtime-shifts/${id}`);
      onChanged();
    } catch (err) {
      console.error("Delete OT shift error:", err);
    }
  };

  if (!shifts.length) {
    return <p className="text-neutral-500 text-sm">No overtime shifts scheduled yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-neutral-300">
        <thead className="text-neutral-500 border-b border-neutral-800">
          <tr>
            <th className="py-2 pr-4">Employee</th>
            <th className="py-2 pr-4">Role</th>
            <th className="py-2 pr-4">Date</th>
            <th className="py-2 pr-4">Start</th>
            <th className="py-2 pr-4">End</th>
            <th className="py-2 pr-4">Rate</th>
            <th className="py-2 pr-4">Reason</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {shifts.map((shift) => (
            <tr key={shift._id}>
              <td className="py-3 pr-4 text-white font-medium">
                {shift.employee?.name}
              </td>
              <td className="py-3 pr-4">{shift.role}</td>
              <td className="py-3 pr-4">{formatDate(shift.date)}</td>
              <td className="py-3 pr-4">{shift.startTime}</td>
              <td className="py-3 pr-4">{shift.endTime}</td>
              <td className="py-3 pr-4 text-amber-400 font-medium">
                {shift.otMultiplier}×
              </td>
              <td className="py-3 pr-4 text-neutral-500 max-w-[160px] truncate">
                {shift.reason || "—"}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    STATUS_STYLES[shift.status]
                  }`}
                >
                  {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  {shift.status !== "approved" && (
                    <button
                      onClick={() => handleStatus(shift._id, "approved")}
                      className="text-emerald-400 hover:text-emerald-300 text-xs transition"
                    >
                      Approve
                    </button>
                  )}
                  {shift.status !== "rejected" && (
                    <button
                      onClick={() => handleStatus(shift._id, "rejected")}
                      className="text-red-400 hover:text-red-300 text-xs transition"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(shift._id)}
                    className="text-neutral-500 hover:text-red-400 text-xs transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
