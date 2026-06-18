import { useEffect, useState } from "react";

export default function TimeTracker() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formattedDate = time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center">
      <h2 className="text-xl font-serif text-white mb-1">{formattedDate}</h2>
      <p className="text-4xl font-bold text-white tracking-wide">{formattedTime}</p>
    </div>
  );
}
