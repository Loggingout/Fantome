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

export default function GrowthAndImpactCTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 pb-24">
      <motion.div
        className="
          rounded-3xl
          border
          border-neutral-800
          bg-neutral-900
          px-8
          py-12
          sm:px-12
          sm:py-14
          text-center
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          The Road Ahead
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          There Is More to Build
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-400">
          Fantome Technologies is still building its foundation. Every product,
          platform, person, and lesson contributes to what the ecosystem can
          become.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/the-mission"
            className="
              inline-flex
              items-center
              justify-center
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
            Read Our Mission
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <Link
            to="/join-the-team"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-neutral-800
              bg-transparent
              px-5
              py-3
              text-sm
              font-medium
              text-neutral-300
              transition-all
              duration-300
              hover:border-neutral-700
              hover:text-white
            "
          >
            Join the Team
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}