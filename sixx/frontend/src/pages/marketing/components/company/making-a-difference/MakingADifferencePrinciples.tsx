import { motion } from "framer-motion";

import { makingADifferencePrinciples } from "../../../data/makingADifference.data";

const sectionReveal = {
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

export default function MakingADifferencePrinciples() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="max-w-2xl mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
      >
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          How We Approach It
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          Listen. Build. Grow.
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          Making a difference requires more than having good intentions. It
          requires paying attention, doing the work, and continuing to improve.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {makingADifferencePrinciples.map(
          ({ tag, title, text }, index) => (
            <motion.article
              key={title}
              className="
                group
                relative
                overflow-hidden
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
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-medium tracking-[0.2em] text-neutral-600">
                  {tag}
                </span>

                <div className="h-px w-8 bg-neutral-700 transition-all duration-300 group-hover:w-12" />
              </div>

              <h3 className="mt-8 text-xl font-semibold text-white">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                {text}
              </p>
            </motion.article>
          ),
        )}
      </div>
    </section>
  );
}