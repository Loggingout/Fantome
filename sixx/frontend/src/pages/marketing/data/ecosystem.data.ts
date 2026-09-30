
import type { LucideIcon } from "lucide-react";
import {
  Plane,
  Clapperboard,
  Server,
  Layers3,
  CloudCog,
} from "lucide-react";

export interface EcosystemArea {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const ecosystemAreas: EcosystemArea[] = [
  {
    id: "aviation",
    name: "Aviation",
    shortName: "Aviation",
    description:
      "Technology built for the aviation ecosystem.",
    icon: Plane,
    href: "/ecosystem/aviation",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    shortName: "Entertainment",
    description:
      "Technology and platforms built within the entertainment ecosystem.",
    icon: Clapperboard,
    href: "/ecosystem/entertainment",
  },
  {
    id: "iaas",
    name: "Infrastructure as a Service",
    shortName: "IaaS",
    description:
      "Infrastructure-focused technology within the Fantome Technologies ecosystem.",
    icon: Server,
    href: "/ecosystem/iaas",
  },
  {
    id: "paas",
    name: "Platform as a Service",
    shortName: "PaaS",
    description:
      "Platform technology supporting the development and operation of products.",
    icon: Layers3,
    href: "/ecosystem/paas",
  },
  {
    id: "saas",
    name: "Software as a Service",
    shortName: "SaaS",
    description:
      "Software products built and operated within the Fantome Technologies ecosystem.",
    icon: CloudCog,
    href: "/ecosystem/saas",
  },
];

