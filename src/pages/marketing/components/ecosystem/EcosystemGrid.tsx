
import { ecosystemAreas } from "../../data/ecosystem.data";
import EcosystemCard from "./EcosystemCard";

export default function EcosystemGrid() {
  return (
    <section className="bg-neutral-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Ecosystem Areas
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Where we build
          </h2>

          <p className="mt-4 text-lg leading-8 text-neutral-600">
            Explore the areas that make up the Fantome Technologies ecosystem.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ecosystemAreas.map((area, index) => (
            <EcosystemCard
              key={area.id}
              area={area}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

