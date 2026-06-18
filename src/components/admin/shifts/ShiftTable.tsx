import api from "../../../utils/api";

interface Shift {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  notes: string;
  employee: { name: string; email: string };
}

interface Props {
  shifts: Shift[];
  onDeleted: () => void;
}

export default function ShiftTable({ shifts, onDeleted }: Props) {
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/shifts/${id}`);
      onDeleted();
    } catch (err) {
      console.error("Delete shift error:", err);
    }
  };

  if (!shifts.length) {
    return <p className="text-neutral-500 text-sm">No shifts scheduled yet.</p>;
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
            <th className="py-2 pr-4">Notes</th>
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
              <td className="py-3 pr-4">
                {new Date(shift.date).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4">{shift.startTime}</td>
              <td className="py-3 pr-4">{shift.endTime}</td>
              <td className="py-3 pr-4 text-neutral-500">
                {shift.notes || "—"}
              </td>
              <td className="py-3">
                <button
                  onClick={() => handleDelete(shift._id)}
                  className="text-red-400 hover:text-red-300 text-xs transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
