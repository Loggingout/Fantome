
import { motion } from "framer-motion";

export default function EcosystemIntro() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Built as an ecosystem
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Technology built beyond a single product.
          </h2>

          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Fantome Technologies develops and operates technology across
            multiple areas, bringing products, infrastructure, and platforms
            together within one growing ecosystem.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

