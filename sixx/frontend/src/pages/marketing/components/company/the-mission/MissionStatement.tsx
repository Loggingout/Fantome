import { motion } from "framer-motion";
import { missionStatement } from "../../../data/mission.data";

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

export default function MissionStatement() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        className="
          max-w-5xl
          mx-auto
          rounded-3xl
          border
          border-neutral-800
          bg-neutral-900
          px-7
          py-10
          sm:px-10
          sm:py-12
          text-center
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          {missionStatement.eyebrow}
        </span>

        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white">
          {missionStatement.title}
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-base leading-relaxed text-neutral-400">
          {missionStatement.description}
        </p>
      </motion.div>
    </section>
  );
}