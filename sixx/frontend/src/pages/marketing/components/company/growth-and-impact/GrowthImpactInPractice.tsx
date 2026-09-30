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

export default function GrowthImpactInPractice() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="
          grid
          lg:grid-cols-[1.15fr_0.85fr]
          gap-8
          items-stretch
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div
          className="
            rounded-3xl
            border
            border-neutral-800
            bg-neutral-900
            p-8
            sm:p-10
          "
        >
          <span className="text-xs tracking-widest uppercase text-neutral-500">
            Impact in Practice
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            Growth Should Strengthen the Ecosystem
          </h2>

          <p className="mt-5 text-sm sm:text-base leading-relaxed text-neutral-400">
            Growth is useful when it helps the ecosystem become more capable.
            That can mean improving a product, strengthening infrastructure,
            bringing new people into the work, or making the experience better
            for the people using our platforms.
          </p>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-500">
            We want growth to create a stronger foundation for what comes next,
            rather than simply becoming a larger collection of products.
          </p>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-neutral-800
            bg-neutral-900
            p-8
            sm:p-10
            flex
            flex-col
            justify-between
          "
        >
          <div>
            <span className="text-xs tracking-widest uppercase text-neutral-500">
              Keep Exploring
            </span>

            <h3 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
              See the Work Behind the Growth
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
              Explore the ecosystem, platforms, mission, and people behind
              Fantome Technologies.
            </p>
          </div>

          <Link
            to="/ecosystem"
            className="
              mt-8
              inline-flex
              w-fit
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
            Explore the Ecosystem
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}