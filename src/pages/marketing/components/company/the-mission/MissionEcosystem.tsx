import { motion } from "framer-motion";

import { missionEcosystem } from "../../../data/mission.data";

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

export default function MissionEcosystem() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="max-w-3xl mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          {missionEcosystem.eyebrow}
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          {missionEcosystem.title}
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          {missionEcosystem.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {missionEcosystem.points.map(
          ({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
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
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-neutral-700
                  bg-neutral-800
                "
              >
                <Icon className="h-5 w-5 text-neutral-300" />
              </div>

              <h3 className="mt-7 text-lg font-semibold text-white">
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