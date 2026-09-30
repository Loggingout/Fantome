import { motion } from "framer-motion";

import type { PlatformStatusRecord } from "../../../data/status.data";
import PlatformStatusCard from "./PlatformStatusCard";

interface StatusPlatformGridProps {
  platforms: PlatformStatusRecord[];
}

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

export default function StatusPlatformGrid({
  platforms,
}: StatusPlatformGridProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          Platform Status
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          Ecosystem Platforms
        </h2>

        <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-400">
          View the current operating state of platforms monitored by Fantome
          Technologies.
        </p>
      </div>

      {platforms.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardReveal}
              custom={index}
            >
              <PlatformStatusCard platform={platform} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          <p className="text-sm text-neutral-400">
            No platform status information is currently available.
          </p>
        </div>
      )}
    </section>
  );
}