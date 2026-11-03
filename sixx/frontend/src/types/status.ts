export type PlatformStatus =
  | "operational"
  | "degraded"
  | "maintenance"
  | "outage"
  | "being_developed"
  | "unknown";

export type IncidentStatus =
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

export interface StatusHistoryPoint {
  date: string;
  status: PlatformStatus;
}

export interface PlatformIncident {
  id: string;
  title: string;
  message?: string;
  status: IncidentStatus;
  startedAt: string;
  updatedAt?: string;
  resolvedAt?: string | null;
  affectedPlatforms?: string[];
}

export interface PlatformStatusRecord {
  id: string;
  name: string;
  category: string;
  description: string;

  status: PlatformStatus;
  statusLabel: string;

  message?: string;
  updatedAt?: string;
  updatedBy?: string;
  enabled?: boolean;

  uptimePercentage?: number | null;
  uptimeHistory?: StatusHistoryPoint[];

  incidents?: PlatformIncident[];
}

export interface StatusUpdatePayload {
  status: PlatformStatus;
  message?: string;
  incident?: {
    title?: string;
    message?: string;
    status: IncidentStatus;
  };
}

export interface CreatePlatformPayload {
  name: string;
  category: string;
  description?: string;
  status: PlatformStatus;
}

export interface StatusCounts {
  total: number;
  operational: number;
  degraded: number;
  maintenance: number;
  outage: number;
  beingDeveloped: number;
  unknown: number;
}