import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  CircleAlert,
  CircleDashed,
  CircleX,
  Wrench,
} from "lucide-react";

export type PlatformStatus =
  | "operational"
  | "degraded"
  | "maintenance"
  | "outage"
  | "unknown";

export interface PlatformStatusRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  status: PlatformStatus;
  statusLabel: string;
  updatedAt?: string;
}

export interface StatusDefinition {
  label: string;
  description: string;
  icon: LucideIcon;
}

export const statusDefinitions: Record<
  PlatformStatus,
  StatusDefinition
> = {
  operational: {
    label: "Operational",
    description: "The platform is operating normally.",
    icon: CheckCircle2,
  },
  degraded: {
    label: "Degraded Performance",
    description:
      "The platform is available, but some functionality may be experiencing reduced performance.",
    icon: CircleAlert,
  },
  maintenance: {
    label: "Maintenance",
    description:
      "The platform is temporarily undergoing planned maintenance.",
    icon: Wrench,
  },
  outage: {
    label: "Service Outage",
    description:
      "The platform is currently experiencing an interruption in service.",
    icon: CircleX,
  },
  unknown: {
    label: "Status Unknown",
    description:
      "The current platform status could not be determined.",
    icon: CircleDashed,
  },
};

export const initialPlatformStatuses: PlatformStatusRecord[] = [
  {
    id: "mystery-mansion",
    name: "Mystery Mansion",
    category: "SaaS Platform",
    description:
      "A platform developed and operated within the Fantome Technologies ecosystem.",
    status: "unknown",
    statusLabel: statusDefinitions.unknown.label,
  },
];

export const statusPageContent = {
  hero: {
    eyebrow: "System Status",
    title: "Ecosystem Status",
    description:
      "Monitor the current operating status of platforms and services within the Fantome Technologies ecosystem.",
  },
  summary: {
    eyebrow: "Current Status",
    title: "Everything in One Place",
    description:
      "This page provides the current status of the ecosystem. Status information is supplied by our monitoring systems and backend services.",
  },
};