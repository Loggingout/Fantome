
import { motion } from "framer-motion";

export default function ServicesHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-24 pb-12 text-center"
    >
      <span className="inline-flex rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
        Services
      </span>

      <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Premium Web Services Built to{" "}
        <span className="text-neutral-400">
          Elevate Your Brand
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
        From beautiful website design to reliable site management,
        our services help you attract attention, build trust, and
        convert more visitors.
      </p>

      <div className="mx-auto mt-10 h-px max-w-24 bg-neutral-800" />
    </motion.section>
  );
}

