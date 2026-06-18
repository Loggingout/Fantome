export default function AttendanceOverview() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl font-serif text-white mb-4">Attendance Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">Present Today</p>
          <p className="text-3xl font-bold text-white">0</p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">On Leave</p>
          <p className="text-3xl font-bold text-white">0</p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
          <p className="text-neutral-400 text-sm">Late Clock‑ins</p>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>
    </div>
  );
}
