import { motion } from "framer-motion";

import { growthMetrics } from "../../../data/growthAndImpact.data";

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: index * 0.1,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export default function GrowthMetrics() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          Our Foundation
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          Where We Are Starting
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          These are foundational markers of Fantome Technologies today. As the
          company and ecosystem develop, this section can grow alongside them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {growthMetrics.map(({ value, label, description }, index) => (
          <motion.article
            key={label}
            className="
              rounded-2xl
              border
              border-neutral-800
              bg-neutral-900
              p-7
              transition-all
              duration-300
              hover:border-neutral-700
            "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardReveal}
            custom={index}
          >
            <p className="text-3xl sm:text-4xl font-bold text-white">
              {value}
            </p>

            <h3 className="mt-3 text-base font-semibold text-neutral-200">
              {label}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              {description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}