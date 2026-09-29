import { motion } from "framer-motion";
import { Users } from "lucide-react";

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

export default function JoinTheTeamContribution() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="
          rounded-3xl
          border
          border-neutral-800
          bg-neutral-900
          p-8
          sm:p-10
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="max-w-4xl">
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
            <Users className="h-5 w-5 text-neutral-300" />
          </div>

          <span className="block mt-7 text-xs tracking-widest uppercase text-neutral-500">
            Your Contribution
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            There Is More Than One Way to Make an Impact
          </h2>

          <p className="mt-5 text-sm sm:text-base leading-relaxed text-neutral-400">
            Building an ecosystem takes more than writing code. It requires
            people who can develop products, think about security, improve
            operations, solve problems, create experiences, and bring new
            perspectives to the work.
          </p>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-500">
            We want people to have room to contribute their strengths while
            continuing to learn and grow with the ecosystem.
          </p>
        </div>
      </motion.div>
    </section>
  );
}