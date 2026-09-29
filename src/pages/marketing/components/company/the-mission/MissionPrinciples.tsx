import { motion } from "framer-motion";

import { missionPrinciples } from "../../../data/mission.data";
import MissionPrincipleCard from "./MissionPrincipleCard";

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

export default function MissionPrinciples() {
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
          What Guides Us
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          Principles Behind the Mission
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          Our mission is more than a statement. These principles influence how
          we approach products, platforms, infrastructure, and the people who
          use them.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {missionPrinciples.map(
          ({ icon, title, text, tag }, index) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardReveal}
              custom={index}
            >
              <MissionPrincipleCard
                icon={icon}
                title={title}
                text={text}
                tag={tag}
              />
            </motion.div>
          ),
        )}
      </div>
    </section>
  );
}