
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { EcosystemArea } from "../../data/ecosystem.data";

interface EcosystemCardProps {
  area: EcosystemArea;
  index: number;
}

export default function EcosystemCard({
  area,
  index,
}: EcosystemCardProps) {
  const Icon = area.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={area.href}
        className="group block h-full rounded-2xl border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-xl"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950 text-white">
            <Icon size={22} />
          </div>

          <ArrowUpRight
            size={20}
            className="text-neutral-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-neutral-950"
          />
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            {area.shortName}
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-neutral-950">
            {area.name}
          </h3>

          <p className="mt-4 leading-7 text-neutral-600">
            {area.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

