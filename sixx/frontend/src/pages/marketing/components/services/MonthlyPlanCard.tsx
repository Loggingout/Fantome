
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";

import {
  serviceIconColors,
  serviceIconMap,
} from "../../data/services.data";

import type { Service } from "../../data/services.data";

interface MonthlyPlanCardProps {
  plan: Service;
  index: number;
}

export default function MonthlyPlanCard({
  plan,
  index,
}: MonthlyPlanCardProps) {
  const Icon = serviceIconMap[plan.icon] ?? Star;

  const iconColor =
    serviceIconColors[plan.category] ?? "text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative flex h-full flex-col rounded-4xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-2xl ${plan.colorClass}`}
    >
      {plan.badge && (
        <div className="absolute right-6 top-6">
          <span className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900">
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-white">
        {plan.name}
      </h3>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-semibold text-white">
          ${plan.price}
        </span>

        {plan.priceUnit && (
          <span className="text-sm text-neutral-500">
            {plan.priceUnit}
          </span>
        )}
      </div>

      <div className="my-6 h-px bg-neutral-800" />

      <ul className="space-y-4">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm leading-5 text-neutral-400"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800">
              <Check className="h-3 w-3 text-neutral-300" />
            </span>

            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <div className="h-px bg-neutral-800 transition-colors duration-300 group-hover:bg-neutral-700" />
      </div>
    </motion.div>
  );
}

