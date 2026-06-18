import { motion } from "framer-motion";

export default function ApproveLeaveRequest() {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  // Placeholder data — replace with backend data later
  const requests = [
    { id: 1, name: "John Doe", type: "Sick Leave", date: "June 20, 2026" },
    { id: 2, name: "Sarah Lee", type: "Vacation", date: "June 25–28, 2026" },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
    >
      <h2 className="text-xl font-serif text-white mb-4">Pending Leave Requests</h2>

      <div className="flex flex-col gap-4">
        {requests.map((req, i) => (
          <motion.div
            key={req.id}
            variants={fadeUp}
            custom={i}
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between"
          >
            <div>
              <p className="text-white font-semibold">{req.name}</p>
              <p className="text-neutral-400 text-sm">{req.type}</p>
              <p className="text-neutral-500 text-xs">{req.date}</p>
            </div>

            <div className="flex gap-3 mt-3 md:mt-0">
              <button className="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition">
                Approve
              </button>
              <button className="bg-red-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-red-400 transition">
                Deny
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
