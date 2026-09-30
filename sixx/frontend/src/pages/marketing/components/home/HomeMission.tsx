import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function HomeMission() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-neutral-800
          bg-neutral-900
          px-8
          py-12
          sm:px-12
          sm:py-14
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="max-w-4xl">
          <span className="text-xs tracking-widest uppercase text-neutral-500">
            Our Mission
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white">
            Build for the Consumer.
            <br />
            <span className="text-neutral-400">
              Scale for the Consumer.
            </span>
            <br />
            Listen to the Consumer.
          </h2>

          <p className="mt-6 max-w-3xl text-sm sm:text-base leading-relaxed text-neutral-400">
            The people who use our products help shape them. We build within
            our own ecosystem, operate what we create, learn from the people
            using it, and continue improving what comes next.
          </p>

          <Link
            to="/the-mission"
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-neutral-700
              bg-neutral-800
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition-all
              duration-300
              hover:border-neutral-600
              hover:bg-neutral-700
            "
          >
            Read the Mission
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}