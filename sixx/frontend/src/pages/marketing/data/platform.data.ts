
import type { LucideIcon } from "lucide-react";
import { Building2 } from "lucide-react";

export interface Platform {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  icon: LucideIcon;
  url: string;
  external: boolean;
}

export const platforms: Platform[] = [
  {
    id: "mystery-mansion",
    name: "Mystery Mansion",
    description:
      "NSFW: A platform developed and operated within the Fantome Technologies ecosystem. Built to provide intimate connections for people across the world.",
    status: "Live",
    category: "SaaS Platform",
    icon: Building2,
    url: "https://mysterymansion.app",
    external: true,
  },
];

