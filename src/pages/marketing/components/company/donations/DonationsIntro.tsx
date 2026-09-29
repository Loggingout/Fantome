import { motion } from "framer-motion";

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

export default function DonationsIntro() {
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
          Why We Accept Support
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          Supporting the Company Behind the Ecosystem
        </h2>

        <p className="mt-5 text-sm sm:text-base leading-relaxed text-neutral-400">
          Fantome Technologies builds and operates technology products within
          its own ecosystem. Keeping that ecosystem moving requires people,
          infrastructure, equipment, and ongoing development.
        </p>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          Donations made directly through Fantome Technologies help support the
          company and the work required to keep our team and platforms
          operating while we continue to grow.
        </p>
      </motion.div>
    </section>
  );
}