
import { fallbackManagementPlans } from "../../data/services.data";

import MonthlyPlanCard from "./MonthlyPlanCard";

import type { Service } from "../../data/services.data";

interface MonthlyPlansProps {
  plans: Service[];
}

export default function MonthlyPlans({
  plans,
}: MonthlyPlansProps) {
  const displayedPlans =
    plans.length > 0 ? plans : fallbackManagementPlans;

  return (
    <section className="mb-24">
      <div className="mb-12 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
          Ongoing Support
        </span>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Monthly Plans
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
          Flexible monthly plans for website management, marketing,
          and SEO — no long-term contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {displayedPlans.map((plan, index) => (
          <MonthlyPlanCard
            key={plan._id}
            plan={plan}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

