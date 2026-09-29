
import { motion } from "framer-motion";

export default function EcosystemVision() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Our Direction
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            Build for the consumer.
            <br />
            Scale for the consumer.
            <br />
            Listen to the consumer.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
            The ecosystem continues to evolve around the people who use the
            technology we build. Every platform gives us another opportunity to
            learn, improve, and build what comes next.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

