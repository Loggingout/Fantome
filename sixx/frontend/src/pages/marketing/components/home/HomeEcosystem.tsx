import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { ecosystemAreas } from "../../data/ecosystem.data";

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
      delay: index * 0.08,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export default function HomeEcosystem() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="max-w-2xl">
          <span className="text-xs tracking-widest uppercase text-neutral-500">
            Where We Build
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            The Fantome Technologies Ecosystem
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
            Our ecosystem brings together industries, infrastructure,
            platforms, and software that support the technology we're building.
          </p>
        </div>

        <Link
          to="/ecosystem"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            text-sm
            font-medium
            text-neutral-300
            transition-colors
            hover:text-white
          "
        >
          Explore the Ecosystem
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ecosystemAreas.map(
          ({ name, shortName, description, icon: Icon, href }, index) => (
            <motion.div
              key={name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardReveal}
              custom={index}
            >
              <Link
                to={href}
                className="
                  group
                  block
                  h-full
                  rounded-2xl
                  border
                  border-neutral-800
                  bg-neutral-900
                  p-6
                  transition-all
                  duration-300
                  hover:border-neutral-700
                "
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800">
                  <Icon className="h-4 w-4 text-neutral-300" />
                </div>

                <p className="mt-5 text-xs uppercase tracking-widest text-neutral-600">
                  {shortName}
                </p>

                <h3 className="mt-2 text-base font-semibold text-white">
                  {name}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  {description}
                </p>

                <div className="mt-5 flex items-center gap-1 text-xs text-neutral-600 transition-colors group-hover:text-neutral-300">
                  Explore
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          ),
        )}
      </div>
    </section>
  );
}