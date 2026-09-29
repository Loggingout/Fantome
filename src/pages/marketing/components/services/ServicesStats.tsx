
import { motion } from "framer-motion";

import { servicesStats } from "../../data/services.data";

export default function ServicesStats() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mb-20 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-800 sm:grid-cols-3"
    >
      {servicesStats.map((stat) => (
        <div
          key={stat.label}
          className="bg-neutral-950 px-6 py-8 text-center transition-colors duration-300 hover:bg-neutral-900"
        >
          <div className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {stat.value}
          </div>

          <div className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            {stat.label}
          </div>
        </div>
      ))}
    </motion.section>
  );
}

