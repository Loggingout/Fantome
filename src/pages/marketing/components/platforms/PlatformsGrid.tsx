
import { platforms } from "../../data/platform.data";
import PlatformCard from "./PlatformCard";

export default function PlatformsGrid() {
  return (
    <section className="bg-neutral-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Platform Directory
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            What we've built
          </h2>

          <p className="mt-4 text-lg leading-8 text-neutral-600">
            Explore platforms currently operating within the Fantome
            Technologies ecosystem.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {platforms.map((platform, index) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

