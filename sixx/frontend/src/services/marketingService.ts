import api from "../utils/api";

export interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  inquiryType: "general" | "business" | "platform" | "careers";
  subject: string;
  message: string;
}

interface SubmissionResponse {
  success: boolean;
  message: string;
}

export async function subscribeToBlogUpdates(email: string): Promise<string> {
  const response = await api.post<SubmissionResponse>("/newsletter/subscribe", { email });
  return response.data.message;
}

export async function submitContactInquiry(payload: ContactSubmission): Promise<string> {
  const response = await api.post<SubmissionResponse>("/contact", payload);
  return response.data.message;
}
