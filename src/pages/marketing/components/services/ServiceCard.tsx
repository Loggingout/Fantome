
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import {
  serviceIconColors,
  serviceIconMap,
} from "../../data/services.data";

import type { Service } from "../../data/services.data";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({
  service,
  index,
}: ServiceCardProps) {
  const Icon = serviceIconMap[service.icon] ?? Star;

  const iconColor =
    serviceIconColors[service.category] ?? "text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative rounded-4xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-2xl ${service.colorClass}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>

        {service.badge && (
          <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300">
            {service.badge}
          </span>
        )}
      </div>

      <h3 className="mb-3 text-2xl font-semibold tracking-tight text-white">
        {service.name}
      </h3>

      <p className="min-h-[84px] text-sm leading-6 text-neutral-400">
        {service.description}
      </p>

      {service.price > 0 && (
        <div className="mt-6 flex items-baseline gap-1 border-t border-neutral-700 pt-5">
          <span className="text-2xl font-semibold text-white">
            ${service.price}
          </span>

          {service.priceUnit && (
            <span className="text-sm text-neutral-500">
              {service.priceUnit}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

