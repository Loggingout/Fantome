
import ServiceCard from "./ServiceCard";

import {
  fallbackServiceCards,
} from "../../data/services.data";

import type { Service } from "../../data/services.data";

interface ServiceGridProps {
  services: Service[];
}

export default function ServiceGrid({
  services,
}: ServiceGridProps) {
  const displayedServices =
    services.length > 0 ? services : fallbackServiceCards;

  return (
    <section className="mb-20">
      <div className="grid gap-8 md:grid-cols-3">
        {displayedServices.map((service, index) => (
          <ServiceCard
            key={service._id}
            service={service}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

