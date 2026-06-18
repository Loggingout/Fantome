export default function PayPeriodAttendance({ records }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mt-6">
      <h2 className="text-xl font-serif text-white mb-4">Attendance for Pay Period</h2>

      <div className="flex flex-col gap-3">
        {records.map((rec) => (
          <div
            key={rec.date}
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex justify-between"
          >
            <p className="text-white">{rec.date}</p>
            <p className="text-neutral-400">{rec.hours} hours</p>
          </div>
        ))}
      </div>
    </div>
  );
}
