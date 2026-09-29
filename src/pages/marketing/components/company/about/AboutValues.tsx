import { motion } from "framer-motion";
import { aboutValueCards } from "../../../data/about.data";
import AboutValueCard from "./AboutValueCard";

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

export default function AboutValues() {
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
          Our Principles
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          How We Build
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          The people who use our products are part of how we think, build, and
          improve the Fantome Technologies ecosystem.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {aboutValueCards.map(({ icon, title, text, tag }, index) => (
          <motion.div
            key={title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardReveal}
            custom={index}
          >
            <AboutValueCard
              icon={icon}
              title={title}
              text={text}
              tag={tag}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}