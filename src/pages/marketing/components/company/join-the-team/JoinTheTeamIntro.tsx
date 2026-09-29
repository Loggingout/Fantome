import { motion } from "framer-motion";

import { joinTheTeamIntro } from "../../../data/joinTheTeam.data";

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

export default function JoinTheTeamIntro() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        className="max-w-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          {joinTheTeamIntro.eyebrow}
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          {joinTheTeamIntro.title}
        </h2>

        <p className="mt-5 text-sm sm:text-base leading-relaxed text-neutral-400">
          {joinTheTeamIntro.description}
        </p>
      </motion.div>
    </section>
  );
}