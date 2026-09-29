import { motion } from "framer-motion";
import { aboutTrustStats } from "../../../data/about.data";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

const statReveal = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export default function AboutTrustSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-neutral-800
          bg-neutral-900
          px-6 py-10
          sm:px-10 sm:py-12
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="max-w-2xl">
          <span className="text-xs tracking-widest uppercase text-neutral-500">
            Built for the Long Term
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            More than individual products.
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
            Fantome Technologies is building an ecosystem designed to evolve
            over time. Our products, platforms, and infrastructure are part of
            a larger technology direction that continues to grow with the
            people who use it.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-neutral-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {aboutTrustStats.map(({ value, label }, index) => (
              <motion.div
                key={label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={statReveal}
                custom={index}
              >
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {value}
                </p>

                <p className="mt-2 text-xs sm:text-sm text-neutral-500">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}