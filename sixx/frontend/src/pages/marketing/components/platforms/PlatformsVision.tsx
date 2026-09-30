
import { motion } from "framer-motion";

export default function PlatformsVision() {
  return (
    <section className="bg-neutral-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            What's Next
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            One platform is only the beginning.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-400">
            Fantome Technologies is building toward a growing ecosystem of
            platforms. As new products move from development into production,
            they will become part of the platforms we operate and maintain.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

