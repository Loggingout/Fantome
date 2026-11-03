import type {
  CreatePlatformPayload,
  PlatformIncident,
  PlatformStatusRecord,
  StatusUpdatePayload,
} from "../types/status";
import api from "../utils/api";

const STATUS_ENDPOINT = "/admin/status";

export async function getPlatformStatuses(): Promise<
  PlatformStatusRecord[]
> {
  const response = await api.get<PlatformStatusRecord[]>(STATUS_ENDPOINT);
  const data = response.data;

  if (!Array.isArray(data)) {
    throw new Error("Invalid platform status response.");
  }

  return data;
}

export async function createPlatform(
  payload: CreatePlatformPayload,
): Promise<PlatformStatusRecord> {
  const response = await api.post<PlatformStatusRecord>(STATUS_ENDPOINT, payload);

  return response.data;
}

export async function updatePlatformStatus(
  platformId: string,
  payload: StatusUpdatePayload,
): Promise<PlatformStatusRecord> {
  const response = await api.patch<PlatformStatusRecord>(
    `${STATUS_ENDPOINT}/${encodeURIComponent(platformId)}`,
    payload,
  );

  return response.data;
}

export async function getIncidentHistory(): Promise<PlatformIncident[]> {
  const response = await api.get<PlatformIncident[]>("/status/incidents");
  if (!Array.isArray(response.data)) {
    throw new Error("Invalid incident history response.");
  }
  return response.data;
}

export async function getPublicPlatformStatuses(): Promise<PlatformStatusRecord[]> {
  const response = await api.get<PlatformStatusRecord[]>("/status");
  if (!Array.isArray(response.data)) {
    throw new Error("Invalid platform status response.");
  }
  return response.data;
}