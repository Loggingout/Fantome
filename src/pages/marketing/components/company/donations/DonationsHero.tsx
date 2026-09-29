import { motion } from "framer-motion";
import { donationsHero } from "../../../data/donations.data";

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

export default function DonationsHero() {
  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <span className="inline-block mb-5 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase">
        {donationsHero.eyebrow}
      </span>

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6">
        Help Us Keep the{" "}
        <span className="text-neutral-400 font-normal italic">
          Ecosystem Growing
        </span>
      </h1>

      <p className="text-neutral-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
        {donationsHero.description}
      </p>

      <div className="mt-12 mx-auto w-16 h-px bg-neutral-700" />
    </motion.section>
  );
}