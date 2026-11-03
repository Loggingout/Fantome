import axios from "axios";

import type {
  ApplicationStatus,
  JobApplicationPayload,
  JobApplicationRecord,
  JobListingPayload,
  JobListingRecord,
} from "../types/careers";
import api from "../utils/api";

const ADMIN_ENDPOINT = "/admin/careers";

// Axios errors only say "status code 400"; surface the server's message instead.
api.interceptors.response.use(undefined, (error) => {
  if (
    axios.isAxiosError<{ message?: string }>(error) &&
    error.config?.url?.startsWith(ADMIN_ENDPOINT) &&
    error.response?.data?.message
  ) {
    error.message = error.response.data.message;
  }
  return Promise.reject(error);
});

export async function getOpenJobs(): Promise<JobListingRecord[]> {
  const response = await api.get<JobListingRecord[]>("/careers/jobs");
  return response.data;
}

export async function applyToJob(
  jobId: string,
  payload: JobApplicationPayload,
): Promise<string> {
  try {
    const response = await api.post<{ message: string }>(
      `/careers/jobs/${encodeURIComponent(jobId)}/apply`,
      payload,
    );
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Unable to submit your application right now.");
  }
}

export async function getAdminJobs(): Promise<JobListingRecord[]> {
  const response = await api.get<JobListingRecord[]>(`${ADMIN_ENDPOINT}/jobs`);
  return response.data;
}

export async function createJob(payload: JobListingPayload): Promise<JobListingRecord> {
  const response = await api.post<JobListingRecord>(`${ADMIN_ENDPOINT}/jobs`, payload);
  return response.data;
}

export async function updateJob(
  id: string,
  payload: JobListingPayload,
): Promise<JobListingRecord> {
  const response = await api.put<JobListingRecord>(
    `${ADMIN_ENDPOINT}/jobs/${encodeURIComponent(id)}`,
    payload,
  );
  return response.data;
}

export async function deleteJob(id: string): Promise<void> {
  await api.delete(`${ADMIN_ENDPOINT}/jobs/${encodeURIComponent(id)}`);
}

export async function getApplications(): Promise<JobApplicationRecord[]> {
  const response = await api.get<JobApplicationRecord[]>(`${ADMIN_ENDPOINT}/applications`);
  return response.data;
}

export async function updateApplication(
  id: string,
  payload: { status?: ApplicationStatus; notes?: string },
): Promise<JobApplicationRecord> {
  const response = await api.patch<JobApplicationRecord>(
    `${ADMIN_ENDPOINT}/applications/${encodeURIComponent(id)}`,
    payload,
  );
  return response.data;
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`${ADMIN_ENDPOINT}/applications/${encodeURIComponent(id)}`);
}
