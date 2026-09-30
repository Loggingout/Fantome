
import { motion } from "framer-motion";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function EcosystemPlatformPreview() {
  return (
    <section className="bg-neutral-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Ecosystem Platforms
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              From ecosystem areas to real platforms.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-400">
              Our ecosystem is more than a collection of ideas. It is where
              Fantome Technologies develops, operates, and continues to evolve
              real technology platforms.
            </p>

            <Link
              to="/platforms"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium transition-colors hover:bg-white hover:text-neutral-950"
            >
              Explore Platforms
              <ArrowUpRight size={17} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-neutral-950">
              <Layers3 size={25} />
            </div>

            <h3 className="mt-8 text-2xl font-semibold">
              Built for the ecosystem
            </h3>

            <p className="mt-4 leading-7 text-neutral-400">
              Each platform contributes to the broader technology ecosystem
              while remaining focused on the people and use cases it was built
              to serve.
            </p>

            <div className="mt-8 h-px bg-white/10" />

            <p className="mt-6 text-sm text-neutral-500">
              More platforms will be introduced as the ecosystem grows.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

