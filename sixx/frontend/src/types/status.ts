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
  message?: string;
  updatedAt?: string;
  updatedBy?: string;
  enabled?: boolean;
}

export interface StatusUpdatePayload {
  status: PlatformStatus;
  message?: string;
}

export interface StatusCounts {
  total: number;
  operational: number;
  degraded: number;
  maintenance: number;
  outage: number;
  unknown: number;
}