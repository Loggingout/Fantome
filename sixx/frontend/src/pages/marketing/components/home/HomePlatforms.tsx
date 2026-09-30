import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { platforms } from "../../data/platform.data";

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

export default function HomePlatforms() {
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
            What We've Built
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            Platforms Within the Ecosystem
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
            Explore the products and platforms built and operated within
            Fantome Technologies.
          </p>
        </div>

        <Link
          to="/platforms"
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
          View All Platforms
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {platforms.slice(0, 2).map(
          (
            {
              name,
              description,
              status,
              category,
              icon: Icon,
              url,
              external,
            },
            index,
          ) => {
            const content = (
              <div
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
              >
                <div className="flex items-start justify-between gap-4">
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

                  <span className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs text-neutral-500">
                    {status}
                  </span>
                </div>

                <p className="mt-7 text-xs uppercase tracking-widest text-neutral-500">
                  {category}
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  {name}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-sm text-neutral-300 transition-colors group-hover:text-white">
                  Explore Platform
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            );

            return (
              <motion.div
                key={name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardReveal}
                custom={index}
              >
                {external ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${name}`}
                  >
                    {content}
                  </a>
                ) : (
                  <Link to={url} aria-label={`View ${name}`}>
                    {content}
                  </Link>
                )}
              </motion.div>
            );
          },
        )}
      </div>
    </section>
  );
}